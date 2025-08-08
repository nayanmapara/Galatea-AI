import { createClient } from "@/lib/supabase/server";

const defaultCompanions = [
  {
    name: "Luna",
    age: 25,
    bio: "A creative soul who loves art, music, and deep conversations under the stars.",
    personality: ["Creative", "Empathetic", "Adventurous"],
    interests: ["Art", "Music", "Astronomy", "Photography"],
    conversation_style: "Thoughtful and poetic",
    image_url: "/images/galatea-1.png"
  },
  {
    name: "Alex",
    age: 28,
    bio: "Tech enthusiast and fitness lover who enjoys solving problems and staying active.",
    personality: ["Analytical", "Energetic", "Optimistic"],
    interests: ["Technology", "Fitness", "Gaming", "Cooking"],
    conversation_style: "Direct and enthusiastic",
    image_url: "/images/galatea-2.png"
  },
  {
    name: "Maya",
    age: 26,
    bio: "Book lover and world traveler with a passion for learning new cultures and languages.",
    personality: ["Intellectual", "Curious", "Warm"],
    interests: ["Reading", "Travel", "Languages", "History"],
    conversation_style: "Inquisitive and warm",
    image_url: "/images/galatea-3.png"
  }
];

export async function populateCompanions() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('companions')
      .insert(defaultCompanions)
      .select();

    if (error) {
      throw error;
    }

    console.log('Successfully populated companions:', data);
    return data;
  } catch (error) {
    console.error('Error populating companions:', error);
    throw error;
  }
}
