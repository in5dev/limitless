import fetch from 'cross-fetch';

export async function getUUID(username: string): Promise<string> {
  const response = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${username}`
  );
  const data = await response.json();
  return data.id;
}

export async function getUsername(uuid: string): Promise<string> {
  const response = await fetch(
    `https://api.mojang.com/user/profiles/${uuid}/names`
  );
  const data = await response.json();
  return data[data.length - 1].name;
}
