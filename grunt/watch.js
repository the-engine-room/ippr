module.exports = {
    icons: {
        files: ['images/svg/*.svg'],
        tasks: ['grunticon:dist']
    },
    css: {
        files: 'scss/**/*.scss',
        tasks: ['sass:dist']
    }
};