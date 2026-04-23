import { signInWithGoogle } from './actions'
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
      <form className="p-8 bg-white shadow-md rounded-lg flex flex-col gap-6 w-96 text-gray-900">
        <h1 className="text-2xl font-bold text-center text-gray-900">Library Login</h1>

        <div className="flex flex-col gap-4 mt-4">
          <button
            formAction={signInWithGoogle}
            className="bg-blue-600 text-white flex-1 p-3 rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  )
}
