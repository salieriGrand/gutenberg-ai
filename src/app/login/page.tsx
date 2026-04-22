import { login, signup } from './actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/')
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form className="p-8 bg-white shadow-md rounded-lg flex flex-col gap-4 w-96">
        <h1 className="text-2xl font-bold text-center">Library Login</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            formAction={login}
            className="bg-blue-600 text-white flex-1 p-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
          <button
            formAction={signup}
            className="bg-gray-200 text-black flex-1 p-2 rounded hover:bg-gray-300"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}
