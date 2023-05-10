module.exports = ({ env }) => ({
    url: env('API_HEROKU_URL'),
    app: {
        keys: env.array('APP_KEYS'),
    },
    webhooks: {
        populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    }
});