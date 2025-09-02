const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    rooms: async (_: any, __: any, { sequelize }: any) => {
      try {
        const rooms = await sequelize.models.Room.findAll();
        return rooms;
      } catch (error) {
        console.error('Error fetching rooms:', error);
        throw new Error('Failed to fetch rooms');
      }
    },

    users: async (_: any, __: any, { sequelize }: any) => {
      try {
        const users = await sequelize.models.User.findAll();
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    },

    room: async (_: any, { code }: { code: string }, { sequelize }: any) => {
      try {
        const room = await sequelize.models.Room.findOne({ where: { code } });
        return room;
      } catch (error) {
        console.error('Error fetching room:', error);
        throw new Error('Failed to fetch room');
      }
    },
  },

  Mutation: {
    createRoom: async (_: any, __: any, { sequelize }: any) => {
      try {
        // Get first user (for now)
        const user = await sequelize.models.User.findOne();
        
        if (!user) {
          return {
            success: false,
            message: 'No users found in database',
          };
        }
        
        const roomCode = uuidv4().split('-')[0]; // Generate unique code
        const room = await sequelize.models.Room.create({ 
          code: roomCode, 
          createdBy: user.id 
        });
        
        return {
          success: true,
          code: room.code,
          roomId: room.id,
        };
      } catch (error) {
        console.error('Error creating room:', error);
        return {
          success: false,
          message: 'Failed to create room',
        };
      }
    },
  },
};

module.exports = { resolvers };
