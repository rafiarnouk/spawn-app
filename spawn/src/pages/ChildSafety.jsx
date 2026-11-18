import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SAFETY_EMAIL = 'spawnappmarketing@gmail.com'

// Child safety standards for Spawn (required by Google Play for social apps).
function ChildSafety() {
  useEffect(() => {
    document.title = 'Spawn - Child safety standards'
  }, [])

  return (
    <div style={{ background: 'radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)' }} className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center px-4 pb-12">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 text-left text-gray-800 space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Child safety standards</h1>

          <p>
            Spawn has zero tolerance for child sexual abuse and exploitation (CSAE), including child sexual abuse
            material (CSAM), grooming, and any sexualization of minors. This content and behaviour is prohibited on
            Spawn, and we act on it as soon as we learn about it.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">Who Spawn is for</h2>
            <p>Spawn is built for adults. You must be 18 or older to create an account.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">Reporting in the app</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Report a person from their profile, using the menu at the top.</li>
              <li>Report an activity from the activity&apos;s menu.</li>
              <li>Report a chat message by pressing and holding it.</li>
              <li>Block anyone from their profile, an activity or a chat message.</li>
            </ul>
            <p>
              You can also email{' '}
              <a className="text-spawn-purple font-semibold underline" href={`mailto:${SAFETY_EMAIL}?subject=${encodeURIComponent('Child safety report')}`}>
                {SAFETY_EMAIL}
              </a>
              . Include the username and what you saw.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">What we do</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>We review every report and remove content that breaks these standards.</li>
              <li>We permanently ban accounts involved in child sexual abuse or exploitation.</li>
              <li>
                We report child sexual abuse material and exploitation to the National Center for Missing &amp;
                Exploited Children (NCMEC), Cybertip.ca and law enforcement, as required by law.
              </li>
              <li>We cooperate with law enforcement investigations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">Contact</h2>
            <p>
              Our child safety contact can be reached at{' '}
              <a className="text-spawn-purple font-semibold underline" href={`mailto:${SAFETY_EMAIL}`}>
                {SAFETY_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ChildSafety
