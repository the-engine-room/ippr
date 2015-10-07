module.exports = {
    minify: {
        expand: true,
        cwd: 'css/',
        src: ['production.css', '!*.min.css'],
        dest: 'css/',
        ext: '.min.css'
    }
};