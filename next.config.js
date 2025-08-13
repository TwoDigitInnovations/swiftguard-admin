// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = nextConfig;

// const withTM = require("next-transpile-modules")([
//   "@fullcalendar/common",
//   "@fullcalendar/react",
//   // "@fullcalendar/timeline",
//   // "@fullcalendar/resource-timeline",
// ]);

// module.exports = withTM({
//   // any other general next.js settings
// });

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'service-app-docs.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid",
  "@fullcalendar/timeline",
  "@fullcalendar/resource-timeline",
  "react-advanced-datetimerange-picker",
  "react-datetime-picker",
]);

module.exports = withTM({}),
  nextConfig

