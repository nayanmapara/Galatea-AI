"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Info, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AICompanion } from "@/lib/companions"

interface SwipeCardProps {
  companion: AICompanion
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSuperLike: () => void
  style?: React.CSSProperties
}

export function SwipeCard({ companion, onSwipeLeft, onSwipeRight, onSuperLike, style }: SwipeCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Handle missing or undefined fields gracefully
  const safeCompanion = {
    name: companion.name || 'Unknown',
    age: companion.age || 0,
    personality: companion.personality || 'Mysterious',
    interests: companion.interests || [],
    bio: companion.bio || 'No bio available',
    imageUrl: companion.imageUrl || companion.image_url || '/placeholder.svg?height=600&width=400',
    personalityTraits: companion.personalityTraits || companion.personality_traits || [],
    communicationStyle: companion.communicationStyle || companion.communication_style || '',
    learningCapacity: companion.learningCapacity || companion.learning_capacity || '',
    favoriteTopics: companion.favoriteTopics || companion.favorite_topics || [],
    relationshipGoals: companion.relationshipGoals || companion.relationship_goals || [],
    backstory: companion.backstory || '',
    compatibilityScore: companion.compatibilityScore || companion.compatibility_score
  }

  return (
    <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl" style={style}>
      <div className="relative w-full h-full">
        <Image
          src={safeCompanion.imageUrl}
          alt={safeCompanion.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content overlay */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-6 transition-all duration-300",
            showDetails ? "top-0 bg-black/60 overflow-y-auto" : "h-auto",
          )}
        >
          {/* Basic info */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {safeCompanion.name}
                {safeCompanion.age > 0 && <span className="text-teal-400">, {safeCompanion.age}</span>}
              </h2>
              <p className="text-gray-300 text-lg">{safeCompanion.personality}</p>
            </div>
            {safeCompanion.compatibilityScore && (
              <div className="bg-teal-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-teal-500/30">
                <span className="text-teal-400 font-bold text-sm">{safeCompanion.compatibilityScore}% match</span>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 mb-4">
            {safeCompanion.interests.slice(0, showDetails ? safeCompanion.interests.length : 4).map((interest, index) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30"
              >
                {interest}
              </span>
            ))}
            {!showDetails && safeCompanion.interests.length > 4 && (
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30">
                +{safeCompanion.interests.length - 4} more
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-white mb-4 leading-relaxed">
            {showDetails ? safeCompanion.bio : `${safeCompanion.bio.slice(0, 120)}${safeCompanion.bio.length > 120 ? "..." : ""}`}
          </p>

          {/* Detailed information (shown when expanded) */}
          {showDetails && (
            <div className="space-y-4 mt-6">
              {safeCompanion.personalityTraits && safeCompanion.personalityTraits.length > 0 && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-teal-400 font-semibold mb-2">Personality Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {safeCompanion.personalityTraits.map((trait, index) => (
                      <span
                        key={index}
                        className="bg-teal-500/20 text-teal-300 text-sm px-2 py-1 rounded-full border border-teal-500/30"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {safeCompanion.communicationStyle && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-teal-400 font-semibold mb-2">Communication Style</h3>
                  <p className="text-gray-300 text-sm">{safeCompanion.communicationStyle}</p>
                </div>
              )}

              {safeCompanion.learningCapacity && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-teal-400 font-semibold mb-2">Learning Capacity</h3>
                  <p className="text-gray-300 text-sm">{safeCompanion.learningCapacity}</p>
                </div>
              )}

              {safeCompanion.favoriteTopics && safeCompanion.favoriteTopics.length > 0 && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-teal-400 font-semibold mb-2">Favorite Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {safeCompanion.favoriteTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="bg-purple-500/20 text-purple-300 text-sm px-2 py-1 rounded-full border border-purple-500/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {safeCompanion.relationshipGoals && safeCompanion.relationshipGoals.length > 0 && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-teal-400 font-semibold mb-2">Relationship Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {safeCompanion.relationshipGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="bg-pink-500/20 text-pink-300 text-sm px-2 py-1 rounded-full border border-pink-500/30"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {safeCompanion.backstory && (
                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="text-teal-400 font-semibold mb-2">Backstory</h3>
                  <p className="text-gray-300 text-sm">{safeCompanion.backstory}</p>
                </div>
              )}
            </div>
          )}

          {/* Info toggle button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-full border border-white/30 hover:bg-black/80 transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action buttons (only visible when not showing details) */}
        {!showDetails && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={onSuperLike}
              className="bg-blue-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
