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
            build: {
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
            },
            debug: {
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
                        cwd: 'src/Scripts',
                        src: ['*'],
                        dest: 'build/Scripts'
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
        },
        react: {
            build: {
                expand: true,
                cwd: "src/JSX",
                src: ["**/*.jsx"],
                dest: "src/Scripts",
                ext: ".js"
            }
        },
        less: {
            build: {
                files: {
                    "src/Styles/Styles.css" : "src/LESS/Styles.less"
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s).
    grunt.registerTask('default', ['less', 'react', 'uglify:build', 'copy:build']);
    grunt.registerTask('debug', ['less', 'react', 'copy:debug']);
};