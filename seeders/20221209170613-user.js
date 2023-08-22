'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        user_id: 1,
        nip: '0',
        name: 'ADMIN',
        username: "admin",
        password: bcrypt.hashSync("P455w0rd!!!", bcrypt.genSaltSync(10)),
        // role: `{ "kitAssignment":true, "kitAssignmentCreate":true, "kitAssignmentUpdate":true, "kitAssignmentDelete":true, "detectionKitManager":true, "historyTrack":true, "geofence":true, "deviceManager":true, "deviceManagerCreate":true, "deviceManagerUpdate":true, "deviceManagerDelete":true, "prisonerManager":true, "prisonerManagerCreate":true, "prisonerManagerUpdate":true, "prisonerManagerDelete":true, "prosecutorManager":true, "prosecutorManagerCreate":true, "prosecutorManagerUpdate":true, "prosecutorManagerDelete":true, "userManagement":true, "userManagementCreate":true, "userManagementUpdate":true, "userManagementDelete":true, "userRole":true, "attorneyManagement":true, "globalSettings":true, "licenseManager":true, "log":true }`,
        role: `{"Dashboard":true,"Kit_Monitoring":true,"Kit_Assignment":true,"Kit_Tracking":true,"Geofence":true,"Device_Management":true,"Prisoner_Management":true,"Prosecutor_Management":true,"User_Management":true,"Role_Management":true,"License_Management":true,"Log":true}`,
        last_login:0,
        deleted:0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
