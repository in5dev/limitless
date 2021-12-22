import axios from 'axios';

export async function getUUID(username: string): Promise<string> {
  const response = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  );
  return response.data.id;
}
