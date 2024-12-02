import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Profile = {
  uuid: string
  id: number
  name: string
  age: number
  bio: string
  imageUrl: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Profile[]>
) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'profiles.json')
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const profiles: Profile[] = JSON.parse(fileContents)
      res.status(200).json(profiles)
    } catch (error) {
      console.error('Error reading profiles:', error)
      res.status(500).json([])
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
