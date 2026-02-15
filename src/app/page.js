import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/login">Go to Login</Link>
      <Link href="/signup">Go to Signup</Link>
    </div>
  )
}

export default page