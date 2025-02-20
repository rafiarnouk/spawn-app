"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Navbar from "./components/Navbar"
import events from "./assets/eventsgraphic.png"
import StarIcon from "./assets/staricon.svg"

function App() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(true)

  useEffect(() => {
    document.title = "Spawn - Beta Access"
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dto = {
      email,
      hasSubscribedToNewsletter: isSubscribed,
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/betaAccessSignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      })
      if (response.ok) {
        alert('Successfully signed up!')
        setEmail('') // Clear the form after successful submission
      } else if (response.status === 409) {
        alert('This email has already been added to the beta access sign up.')
      } else {
        alert('Failed to sign up. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const herobody = (
    <div className="flex-1 text-left">
      <h1 className="text-6xl font-extrabold text-gray-900">
        Get notified for our <span className="text-spawn-purple">beta release.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-700">
        Make every impromptu plan effortless. Stay in the loop and be the first to try <span className="text-spawn-purple">Spawn</span> when we go live! ⭐
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center items-center space-x-4 mt-10">
        <Input
          className="bg-white rounded-full p-6"
          type="email"
          placeholder="Email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button className="rounded-full p-6 px-8" type="submit">
          Notify Me
          <img src={StarIcon} alt="Star Icon" className="mb-0.5 ml-1" />
        </Button>
      </form>
      <div className="flex items-center mt-6 space-x-2">
        <Checkbox
          className="rounded-md"
          id="newsletter"
          checked={isSubscribed}
          onCheckedChange={setIsSubscribed}
        />

        <label
          htmlFor="newsletter"
          className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Subscribe to our newsletter and get exclusive updates on Spawn!
        </label>
      </div>
    </div>
  )

  const herographic = (
    <div className="flex-1">
      <img
        src={events}
        alt="Events Graphic"
        className="w-full h-full object-cover rounded-lg"
        style={{ filter: "drop-shadow(0px 35px 25px rgba(134, 147, 255, 0.4))" }}
      />
    </div>
  )

  const bggrad = {
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)`,
  }

  return (
    <>
      <div style={bggrad}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pb-12">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-20 md:space-y-0 md:space-x-20 p-8 max-w-screen-xl">
            {herobody}
            {herographic}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
