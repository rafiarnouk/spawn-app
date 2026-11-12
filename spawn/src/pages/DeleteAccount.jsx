import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SUPPORT_EMAIL = 'spawnappmarketing@gmail.com'
const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Delete my Spawn account')}&body=${encodeURIComponent(
  'Please delete my Spawn account.\n\nUsername:\nEmail or phone on the account:\n'
)}`

// Account deletion instructions for Spawn (linked from Google Play's data safety section).
function DeleteAccount() {
  useEffect(() => {
    document.title = 'Spawn - Delete your account'
  }, [])

  return (
    <div style={{ background: 'radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)' }} className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center px-4 pb-12">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 text-left text-gray-800 space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Delete your Spawn account</h1>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">In the app (fastest)</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Open Spawn and go to the <b>Profile</b> tab.</li>
              <li>Tap the menu in the top right, then <b>Delete account</b>.</li>
              <li>Confirm. Your account is deleted right away.</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">Without the app</h2>
            <p>
              Email{' '}
              <a className="text-spawn-purple font-semibold underline" href={mailto}>
                {SUPPORT_EMAIL}
              </a>{' '}
              from the address on your account (or include your username and phone number) and ask us to delete it.
              We&apos;ll delete it within 30 days and reply to confirm.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">What gets deleted</h2>
            <p>Deleting your account permanently removes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your profile: name, username, email, phone number and profile picture</li>
              <li>Your interests and social links</li>
              <li>Your friends, friend requests and blocked users</li>
              <li>Activities you created, your RSVPs and your chat messages</li>
              <li>Your sign-in connections (Google / Apple) and notification tokens</li>
            </ul>
            <p>We don&apos;t keep any of this after deletion, and it can&apos;t be recovered.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DeleteAccount
