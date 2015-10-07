module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: 'images/svg/',
            src: ['*.svg'],
            dest: "css"
        }],
        options: {
            pngfolder: '../images/svg-fallback',
            cssprefix: '.Icon--'
        }
    }
};