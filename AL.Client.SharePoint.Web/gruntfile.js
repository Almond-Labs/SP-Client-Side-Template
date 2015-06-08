module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/Scripts',
                    src: '**/*.js',
                    dest: 'build/Scripts'
                }]
            }
        },
        copy: {
            main: {
                expand: true,
                files: [
                    {
                        expand: true,
                        cwd: 'src/References',
                        src: ['*'],
                        dest: 'build/References'
                    },
                    {
                        expand: true,
                        cwd: 'src/Styles',
                        src: ['*'],
                        dest: 'build/Styles'
                    },
                    {
                        expand: true,
                        cwd: 'Test/Scripts/Refs',
                        src: ['*'],
                        dest: 'build/References'
                    },
                    {
                        expand: true,
                        cwd: 'Test/Styles',
                        src: ['*'],
                        dest: 'build/Styles'
                    },
                    {
                        expand: true,
                        cwd: 'build',
                        src: ['**'],
                        dest: '../AL.Client.SharePoint/Modules/Style Library'
                    }
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy']);

};