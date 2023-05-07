'use strict';

/**
 * `is-manager` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In is-manager policy.');

    try {
      // Get tutorial id from request
      const { id } = policyContext.params;

      // Get the tutorial by id
      const tutorial = await strapi.service('api::tutorial.tutorial').findOne(id, {
        populate: ['classroom.manager']
      });

      // current logged in user
      const { user } = policyContext.state;

      // check if classroom manager is logged in user
      const { classroom: { manager }} = tutorial;
      if (manager && manager.id === user.id) return true;

      return false;
    } catch (e) {
      strapi.log.error(`Error in is-manager policy: ${e}`);
      return false;
    }
};
