'use strict';

/**
 * classroom service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::classroom.classroom', ({strapi}) => ({
    findTutorials(classroomId) {
        strapi.log.debug(`findTutorials: classroomId = ${classroomId}`);
        return strapi.entityService.findMany('api::tutorial.tutorial', {
            filters: { classroom: classroomId},
            populate: ['classroom', 'classroom.manager', 'coverImage']
        })
    }
}));
