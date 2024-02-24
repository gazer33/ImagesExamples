'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AccountForm({ user }) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return ( <div className="form-widget max-w-md mx-auto bg-gray-800 p-8 rounded-md shadow-md">
  <div className="mb-4">
    <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
      Email
    </label>
    <input
      id="email"
      type="text"
      value={user?.email}
      disabled
      className="w-full p-2 border border-gray-500 rounded-md"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="fullName" className="block text-white text-sm font-semibold mb-2">
      Full Name
    </label>
    <input
      id="fullName"
      type="text"
      value={fullname || ''}
      onChange={(e) => setFullname(e.target.value)}
      className="w-full p-2 border border-gray-500 rounded-md"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="username" className="block text-white text-sm font-semibold mb-2">
      Username
    </label>
    <input
      id="username"
      type="text"
      value={username || ''}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full p-2 border border-gray-500 rounded-md"
    />
  </div>
  <div className="mb-4">
    <label htmlFor="website" className="block text-white text-sm font-semibold mb-2">
      Website
    </label>
    <input
      id="website"
      type="url"
      value={website || ''}
      onChange={(e) => setWebsite(e.target.value)}
      className="w-full p-2 border border-gray-500 rounded-md"
    />
  </div>

  <div>
    <button
      className="button primary block w-full bg-blue-500 text-white"
      onClick={() => updateProfile({ fullname, username, website, avatar_url })}
      disabled={loading}
    >
      {loading ? 'Loading ...' : 'Update'}
    </button>
  </div>
  <form action="/images-list" method="post">
      <button className="button block w-full bg-green-500 text-white" type="submit">
       CONTINUE
      </button>
    </form>
  <div className="mt-4">
    <form action="/auth/signout" method="post">
      <button className="button block w-full bg-red-500 text-white" type="submit">
        Sign out
      </button>
    </form>
  </div>
</div>
)
}