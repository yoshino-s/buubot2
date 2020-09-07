/**
 * @ 0b00000001 friend
 * @ 0b00000010 group member
 * @ 0b00000100 group admin
 * @ 0b00001000 group owner
 * @ 0b00010000 temp chat
 */
export enum CommandPermission {
  friend = 0b00000001,
  group = 0b00001110,
  member = 0b00000010,
  admin = 0b00001100,
  administrator = 0b00000100,
  owner = 0b00001000,
  temp = 0b00010000,
}

export const permissionInstruction = `\
* 0b00000001 friend
* 0b00000010 group member
* 0b00000100 group admin
* 0b00001000 group owner
* 0b00010000 temp chat\
`;
