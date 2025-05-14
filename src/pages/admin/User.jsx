import React, { useEffect, useState, useRef } from 'react'
import {UserView, InviteModal} from '../../components/modals/UserModal'
import AdminNav from '../../components/navbar/AdminNav'
// import InviteModal from '../../components/modals/UserModal' // Import the new component?
import { connectWebSocket, closeWebSocket } from '../../utils/services/websocket'
import {ConfirmationModal} from '../../components/modals/ConfirmationModal'

import axios from 'axios'

const User = () => {
  const [users, setUsers] = useState([])
  const [pendingInvitations, setPendingInvitations] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showUser, setShowUser] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [processingAction, setProcessingAction] = useState(null)
  const [inviteError, setInviteError] = useState(null)
  const [showConfirmation, setConfirmation] = useState(false)
  const [invitationToRevoke, setInvitationToRevoke] = useState(null)

  const colorMap = {
    A: '#FF6666',
    B: '#FF9933',
    C: '#FFD700',
    D: '#66CC66',
    E: '#0099CC',
    F: '#9933CC',
    G: '#FF3399',
    H: '#6666FF',
    I: '#00CC99',
    J: '#FF6600',
    K: '#3399FF',
    L: '#FF3366',
    M: '#33CC33',
    N: '#FFCC00',
    O: '#336699',
    P: '#990000',
    Q: '#FF6699',
    R: '#666600',
    S: '#669900',
    T: '#009999',
    U: '#6600CC',
    V: '#CC3300',
    W: '#99CC00',
    X: '#9966FF',
    Y: '#FF0000',
    Z: '#33CCCC',
  }

  const token = localStorage.getItem('token')

  const API_URL = import.meta.env.VITE_API_URL

  const fetchUsers = () => {
    axios
      .get(`${API_URL}/api/auth/fetchUsers`, 
        { withCredentials: true })
      .then((response) => {
        setUsers(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching users:',
          error.response?.data || error.message
        )
        setUsers('Failed to load users.')
      })
  }

  const fetchPendingInvitations = () => {
    setInviteError(null)
    axios
      .get(`${API_URL}/api/auth/invitations`, 
        { withCredentials: true })
      .then((response) => {
        setPendingInvitations(response.data || [])
      })
      .catch((error) => {
        console.error(
          'Error fetching invitations:',
          error.response?.data || error
        )
        setInviteError('Failed to load pending invitations')
      })
  }

  const handleInviteSubmit = (invitation) => {
    setPendingInvitations([invitation, ...pendingInvitations])
  }

  const handleResendInvite = async (id) => {
    setProcessingAction(id)
    try {
      await axios.post(
        `${API_URL}/api/auth/invitations/${id}/resend`,
        {},
        { withCredentials: true }
      )
      fetchPendingInvitations()
    } catch (error) {
      console.error('Failed to resend invitation:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleRevokeInvite = async (id) => {
    setProcessingAction(id)
    try {
      await axios.delete(`${API_URL}/api/auth/invitations/${id}`, 
        { withCredentials: true })

      setPendingInvitations(pendingInvitations.filter((inv) => inv.id !== id))
    } catch (error) {
      console.error('Failed to revoke invitation:', error)
    } finally {
      setProcessingAction(null)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchPendingInvitations()

    const handleDataChange = () => {
      fetchUsers()
      fetchPendingInvitations()
    }

    const handleRefresh = () => {
      fetchUsers()
      fetchPendingInvitations()
    }

    connectWebSocket(handleDataChange, handleRefresh)

    return () => {
      closeWebSocket()
    }
  }, [])

  const viewUser = (id) => {
    setSelectedUserId(id)
    setShowUser(true)
  }

  const handleConfirmation = async (result) => {
    setConfirmation(false)
    if (result && invitationToRevoke) {
      await handleRevokeInvite(invitationToRevoke.id)
      setInvitationToRevoke(null)
    }
    console.log('User confirmed?', result)
  }

  console.log(users)

  return (
    <>
      {showConfirmation && (
        <ConfirmationModal
          title="Revoke Invite?"
          description="Are you sure you want to revple the invitation to this email? This action will revoke the current invitaiton to the user."
          icon="warning"
          onClose={handleConfirmation}
        />
      )}

      {showUser && (
        <UserView
          key={selectedUserId}
          userId={selectedUserId}
          onClose={() => setShowUser(false)}
        />
      )}

      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteSubmit}
        />
      )}

      <div className="w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]">
        <div className="bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto">
          <AdminNav />
        </div>
        <div className="w-full min-h-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] bg-[#151515] overflow-y-scroll">
          <span className="text-5xl font-semibold text-white">
            User Management
          </span>
          <div className="w-full h-full flex flex-col">
            <div className="w-full min-h-[30rem] border-t-1 py-10 border-t-[#373737] flex flex-col sm:flex-row sm:justify-between">
              <div className="w-full h-full gap-y-4 flex flex-col">
                <span className="text-white text-3xl font-semibold w-fit">
                  Users
                </span>
                <span className="text-xl w-[25rem] text-[#9C9C9C]">
                  Manage system by users by assigning roles, updating account
                  details, and controlling access levels.
                </span>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="cursor-pointer w-fit h-fit rounded-md px-4 py-2 bg-[#6F3FFF] text-white font-semibold"
                >
                  Invite People
                </button>
              </div>
              <div className="w-full sm:min-w-[70rem] h-full rounded-xl bg-[#1C1B19] border-1 border-[#373737] overflow-y-scroll">
                {users.length > 0 ? (
                  users.map((user) => {
                    const id = user.Credential.id
                    const fullName = `${user.Credential.first_name} ${user.Credential.last_name}`
                    const email = user.Credential.email
                    const status = user.status
                    const role =
                      user.Credential.role.charAt(0).toUpperCase() +
                      user.Credential.role.slice(1).toLowerCase()
                    const initials = `${user.Credential.first_name.charAt(
                      0
                    )}${user.Credential.last_name.charAt(0)}`
                    const firstInitial = initials.charAt(0)
                    const bgColor = colorMap[firstInitial] || '#FFFFFF'

                    return (
                      <div
                        key={id}
                        className="hover:bg-gray-800 cursor-pointer w-full h-[5rem] flex justify-between px-4 sm:pl-20 sm:pr-10 border-b-1 border-[#373737]"
                      >
                        <div
                          onClick={() => viewUser(id)}
                          className="w-full h-full flex gap-x-2 sm:gap-x-7 items-center"
                        >
                          <div
                            className={`w-6 h-6 rounded-full ${
                              status === 'active'
                                ? 'bg-green-600'
                                : 'bg-amber-50'
                            }`}
                          ></div>
                          <div
                            className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center"
                            style={{ backgroundColor: bgColor }}
                          >
                            <span className="text-2xl font-semibold">
                              {initials}
                            </span>
                          </div>
                          <div className="w-fit h-full justify-center flex flex-col">
                            <span className="text-white text-xl sm:text-2xl font-semibold">
                              {fullName}
                            </span>
                            <span className="text-lg sm:text-lg font-semibold text-[#9C9C9C]">
                              {email}
                            </span>
                          </div>
                        </div>
                        <div className="w-fit gap-x-3 h-full flex items-center">
                          <div className="w-25 h-full flex items-center justify-center">
                            <span className="text-xl text-white font-semibold w-full text-center py-2 rounded border bg-[#3A3A3A] border-[#A6A6A6]">
                              {role}
                            </span>
                          </div>
                          <i className="hover:ring-3 fa-solid fa-trash text-xl sm:text-3xl cursor-pointer text-[#999999]"></i>
                          <i className="hover:ring-3 fa-solid fa-user-pen text-xl sm:text-3xl cursor-pointer text-[#999999]"></i>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center py-6">
                    <span className="text-[#9C9C9C] text-xl">
                      No pending invitations
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-fit sm:h-full gap-y-10 flex border-t-1 py-10 border-t-[#373737] flex-col sm:flex-row ">
              <div className="w-full h-fit sm:h-full gap-y-4 flex flex-col">
                <span className="text-white text-3xl font-semibold w-fit">
                  Pendings
                </span>
                <span className="text-xl w-[25rem] text-[#9C9C9C]">
                  View and manage pending user invitations. Approve, resend, or
                  revoke invites to control system access.
                </span>
              </div>

              <div className="w-full sm:min-w-[70rem] h-[15rem] sm:h-full rounded-xl bg-[#1C1B19] border-1 border-[#373737]">
                {inviteError ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-red-400 text-xl">{inviteError}</span>
                  </div>
                ) : pendingInvitations && pendingInvitations.length > 0 ? (
                  pendingInvitations.map((invitation) => {
                    // Check if invitation has the necessary properties
                    if (
                      !invitation ||
                      !invitation.first_name ||
                      !invitation.last_name ||
                      !invitation.email
                    ) {
                      return null
                    }

                    const fullName = `${invitation.first_name} ${invitation.last_name}`
                    const initials = `${invitation.first_name.charAt(
                      0
                    )}${invitation.last_name.charAt(0)}`
                    const firstInitial = initials.charAt(0)
                    const bgColor = colorMap[firstInitial] || '#FFFFFF'
                    const isProcessing = processingAction === invitation.id

                    return (
                      <div
                        key={invitation.id}
                        className="w-full h-[5rem] flex justify-between px-4 sm:px-20 border-b-1 border-[#373737]"
                      >
                        <div className="w-fit h-full flex gap-x-2 sm:gap-x-7 items-center">
                          <div
                            className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center"
                            style={{ backgroundColor: bgColor }}
                          >
                            <span className="text-2xl font-semibold">
                              {initials}
                            </span>
                          </div>
                          <div className="w-fit h-full justify-center flex flex-col">
                            <span className="text-white text-xl sm:text-2xl font-semibold">
                              {fullName}
                            </span>
                            <span className="text-lg sm:text-lg font-semibold text-[#9C9C9C]">
                              {invitation.email}
                            </span>
                          </div>
                        </div>

                        <div className="w-fit gap-x-3 h-full flex items-center">
                          <button
                            onClick={() => handleResendInvite(invitation.id)}
                            disabled={isProcessing}
                            className="cursor-pointer w-fit h-fit rounded-md px-4 py-2 bg-[#3A3A3A] border-[#A6A6A6] border-1 text-white font-semibold flex items-center justify-center min-w-[8rem]"
                          >
                            {isProcessing ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              'Resend Invite'
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setInvitationToRevoke(invitation)
                              setConfirmation(true)
                            }}
                            disabled={isProcessing}
                            className="cursor-pointer w-fit h-fit rounded-md px-4 py-2 border-[#FF8080] border-1 text-[#FF8080] font-semibold flex items-center justify-center min-w-[8rem]"
                          >
                            {isProcessing ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              'Revoke Invite'
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#9C9C9C] text-xl">
                      No pending invitations
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default User
