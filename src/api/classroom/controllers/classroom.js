'use strict';

/**
 * classroom controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { sanitize } = require('@strapi/utils');

module.exports = createCoreController('api::classroom.classroom', ({strapi}) => ({
    // find tutorials for a classroom
    async findTutorials(ctx) {
        //ctx.response.status = 501;
        const {params} = ctx;
        strapi.log.debug(`params: ${JSON.stringify(params)}`);
        //strapi.log.debug(`query: ${JSON.stringify(ctx.query)}`);
        const results = await strapi.service('api::classroom.classroom').findTutorials(params.id);

        const model = strapi.getModel('api::tutorial.tutorial');
        const sanitizedResults = await sanitize.contentAPI.output(results, model);

        return this.transformResponse(sanitizedResults);
    },
    // tactical database seeding
    /*async seed(ctx) {
        try {
            const classroomsPromise = [];
            // min/max values for max # students
            const min = 1;
            const max = 30;
            // # classrooms to be created
            const numberOfClasses = 50;

            // seed the data and create array of promises
            Array(numberOfClasses)
                .fill(null)
                .forEach((_item, index) => {
                    const name = `classroom_${index + 1}`;
                    const maxStudents = Math.random() * (max - min + 1) + min;
                    classroomsPromise.push(
                        strapi.service('api::classroom.classroom').create({
                            data: {
                                name,
                                description: `Description of classroom ${name}`,
                                maxStudents: Math.floor(maxStudents)
                            }
                        })
                    )
                })

            await Promise.all(classroomsPromise);
            return { message: "Ok"}
        } catch (e) {
            strapi.log.error(`Failed to seed database: ${e}`)
        }
    }*/
}));
