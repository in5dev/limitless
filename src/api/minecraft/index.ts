import axios from 'axios';

export async function getUUID(username: string): Promise<string> {
  const response = await axios.get(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  );
  return response.data.id;
}

export async function getUsername(uuid: string): Promise<string> {
  const response = await axios.get(
    `https://api.mojang.com/user/profiles/${uuid}/names`
  );
  return response.data[response.data.length - 1].name;
}
