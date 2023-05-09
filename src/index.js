'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    
    /**
     * Create role if it does not exist in the system
     * @param {*} name The role name
     * @param {*} type The role type
     * @param {*} description The role description
     */
    const createRoleIfNotExist = async (name, type, description = '') => {
      strapi.log.debug(`***Checking if Role Exists - [${name}] -> [${type}]`);
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: {type}});
      if (!role) {
        await strapi.db.query('plugin::users-permissions.role').create({
          data: {
            name, 
            type, 
            description
          }
        });
        strapi.log.debug(`\tCreated role ${name}`);
      } else {
        strapi.log.debug(`\tRole Exists - [${name}] -> [${type}]`);
      }
    }

    /**
     * Enable action on a controller for a specific role
     * @param {*} type The role type
     * @param {*} apiName The name of the api where the controller exists
     * @param {*} controller The controller where the action lives
     * @param {*} action The action itself
     */
    const enablePermission = async (type, apiName, controller, action, namespace = 'api') => {
      strapi.log.info(`***Checking ${type} -> ${apiName} -> ${controller} -> ${action}...`);
      try {
        // Get the role entity
        const role = await strapi.db.query('plugin::users-permissions.role')
          .findOne({
            where: { type },
            populate: ['permissions']
          });

        const actionId = `${namespace}::${apiName}.${controller}.${action}`;
        // get the permissions associated with the role
        const rolePermission = role.permissions.find(permission => permission.action === actionId);

        if (!rolePermission) {
          // permission not created yet (first time
          // starting server)
          strapi.log.debug(`\tCreating ${type} -> ${apiName} -> ${controller} -> ${action}...`);
          strapi.db.query('plugin::users-permissions.permission').create({
            data: {
              action: actionId,
              role: role.id
            }
          });
        } else {
          strapi.log.debug(`\tPermission ${type} -> ${apiName} -> ${controller} -> ${action} exists...`);
        }
      } catch (e) {
        strapi.log.error(`Bootstrap script: Could not update settings: ${controller} -> ${action} [${e}]`);
      }
    }

    strapi.log.info('***Bootstrapping Strapi Server... Hello Strapi!');
    
    // check if roles exist in database
    strapi.log.info('***Checking Roles...');
    await createRoleIfNotExist('Student', 'student', 'A Student');
    await createRoleIfNotExist('Teacher', 'teacher', 'A Teacher');
    await createRoleIfNotExist('Admin', 'admin', 'An Admin');

    // set up permissions for admin role if they don't exist
    strapi.log.info('***Checking Admin Permissions...');
    await enablePermission('admin', 'classroom', 'classroom', 'create');
    await enablePermission('admin', 'classroom', 'classroom', 'find');
    await enablePermission('admin', 'classroom', 'classroom', 'findOne');
    await enablePermission('admin', 'classroom', 'classroom', 'findTutorials');
    await enablePermission('admin', 'classroom', 'classroom', 'update');
    await enablePermission('admin', 'classroom', 'classroom', 'delete');

    await enablePermission('admin', 'info', 'info', 'delete');
    await enablePermission('admin', 'info', 'info', 'update');
    await enablePermission('admin', 'info', 'info', 'find');

    await enablePermission('admin', 'tutorial', 'tutorial', 'create');
    await enablePermission('admin', 'tutorial', 'tutorial', 'update');
    await enablePermission('admin', 'tutorial', 'tutorial', 'delete');
    await enablePermission('admin', 'tutorial', 'tutorial', 'findOne');


  },
};
