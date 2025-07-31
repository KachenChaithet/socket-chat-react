import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000' : '/'

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningup: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')

            set({ authUser: res.data })
            get().connectsocket()

        } catch (error) {
            console.log("ERROR in check auth", error);

            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningup: true })
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data })
            toast.success('Sign Up successfully')
            get().connectsocket()


        } catch (error) {
            toast.error(error.response.data.message)

        } finally {
            set({ isSigningup: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIng: true })
        try {
            const res = await axiosInstance.post('/auth/login', data)
            set({ authUser: res.data })
            toast.success("Log in successfully");

            get().connectsocket()
        } catch (error) {
            toast.error(error.response.data.message)

        } finally {
            set({ isLoggingIng: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({ authUser: null })
            toast.success('Logged out successfully')
            get().disnectsocket()
        } catch (error) {
            toast.error(error.response.data.message)

        }


    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({ authUser: res.data })
            toast.success('UpdateProfile successfully')

        } catch (error) {
            toast.error(error.response.data.message)

        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectsocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        })
        socket.connect()

        set({ socket: socket })

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disnectsocket: () => {
        if (get().socket?.connected) get().socket?.disconnect()
    }


}))