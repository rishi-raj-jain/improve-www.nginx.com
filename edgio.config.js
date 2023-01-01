module.exports = {
  routes: './src/routes.ts',
  connector: './node_modules',
  backends: {
    origin: {
      domainOrIp: 'www.nginx.com',
      hostHeader: 'www.nginx.com',
      disableCheckCert: true,
    },
  },
}
