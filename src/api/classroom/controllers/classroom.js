'use strict';

/**
 * classroom controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { sanitize } = require('@strapi/utils');

module.exports = createCoreController('api::classroom.classroom', ({strapi}) => ({
    async findTutorials(ctx) {
        //ctx.response.status = 501;
        const {params} = ctx;
        strapi.log.debug(`params: ${JSON.stringify(params)}`);
        //strapi.log.debug(`query: ${JSON.stringify(ctx.query)}`);
        const results = await strapi.service('api::classroom.classroom').findTutorials(params.id);

        const model = strapi.getModel('api::tutorial.tutorial');
        const sanitizedResults = await sanitize.contentAPI.output(results, model);

        return this.transformResponse(sanitizedResults);
    }
}));
