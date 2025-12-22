import type { VercelRequest, VercelResponse } from '@vercel/node'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyA3MgZqAkuEnM-QbxabUABFDCT_bUGPTQ0'
const CHANNEL_HANDLE = '@Badminton_4Life'

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  viewCount?: string
  duration?: string
}

interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    publishedAt: string
    thumbnails: {
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
  }
}

interface YouTubeChannelItem {
  id: string
  snippet: {
    title: string
    customUrl?: string
  }
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string
    }
  }
}

interface YouTubePlaylistItem {
  snippet: {
    title: string
    publishedAt: string
    thumbnails: {
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
    resourceId: {
      videoId: string
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Step 1: Get channel ID from handle
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${CHANNEL_HANDLE.replace('@', '')}&key=${YOUTUBE_API_KEY}`
    )
    
    if (!channelResponse.ok) {
      throw new Error(`Channel API error: ${channelResponse.status}`)
    }

    const channelData = await channelResponse.json()
    
    if (!channelData.items || channelData.items.length === 0) {
      // Try search by custom URL
      const searchChannelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`
      )
      const searchData = await searchChannelResponse.json()
      
      if (!searchData.items || searchData.items.length === 0) {
        return res.status(404).json({ error: 'Channel not found', videos: [] })
      }
    }

    const channel: YouTubeChannelItem = channelData.items[0]
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads

    if (!uploadsPlaylistId) {
      return res.status(404).json({ error: 'Uploads playlist not found', videos: [] })
    }

    // Step 2: Get videos from uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=6&key=${YOUTUBE_API_KEY}`
    )

    if (!videosResponse.ok) {
      throw new Error(`Videos API error: ${videosResponse.status}`)
    }

    const videosData = await videosResponse.json()

    const videos: YouTubeVideo[] = (videosData.items || []).map((item: YouTubePlaylistItem) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || 
                 item.snippet.thumbnails.medium?.url || 
                 item.snippet.thumbnails.default?.url || '',
      publishedAt: item.snippet.publishedAt
    }))

    return res.status(200).json({
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        handle: CHANNEL_HANDLE
      },
      videos
    })

  } catch (error) {
    console.error('YouTube API error:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch YouTube videos',
      message: error instanceof Error ? error.message : 'Unknown error',
      videos: []
    })
  }
}
