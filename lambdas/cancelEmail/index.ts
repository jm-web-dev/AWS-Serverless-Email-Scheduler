export default {
  name: `cancelEmail`,
  handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.main`
}