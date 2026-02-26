import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Package } from 'lucide-react';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Shoes', href: '/products' },
    { label: 'Men\'s Footwear', href: '/products?gender=men' },
    { label: 'Women\'s Footwear', href: '/products?gender=women' },
    { label: 'Kids', href: '/products?gender=kids' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Sale', href: '/products?filter=sale' },
  ],
  Help: [
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchange', href: '/returns' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'FAQs', href: '/faqs' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Grid container spacing={6}>
          {/* Brand */}
          <Grid item xs={12} md={3}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <Typography variant="h6" fontWeight={700} color="white">
                StepStyle
              </Typography>
            </div>
            <Typography variant="body2" color="grey.400" sx={{ mb: 3, lineHeight: 1.8 }}>
              India's premium destination for footwear. From classic kolhapuris to modern
              sneakers — every step deserves style.
            </Typography>
            <div className="flex gap-1">
              {[
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: TwitterIcon, label: 'Twitter' },
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: YouTubeIcon, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <IconButton
                  key={label}
                  aria-label={label}
                  size="small"
                  sx={{ color: 'grey.400', '&:hover': { color: 'orange.400', bgcolor: 'grey.800' } }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </div>
          </Grid>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <Grid item xs={6} sm={4} md={2} key={title}>
              <Typography variant="subtitle2" fontWeight={700} color="white" sx={{ mb: 2 }}>
                {title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {links.map(({ label, href }) => (
                  <Box component="li" key={label} sx={{ mb: 1 }}>
                    <Link
                      href={href}
                      underline="none"
                      sx={{
                        color: 'grey.400',
                        fontSize: '0.875rem',
                        '&:hover': { color: 'orange.400' },
                        transition: 'color 0.2s',
                      }}
                    >
                      {label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" fontWeight={700} color="white" sx={{ mb: 2 }}>
              Stay in the Loop
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              Get new arrivals, exclusive deals, and style tips straight to your inbox.
            </Typography>
            <Box
              component="form"
              onSubmit={(e: React.FormEvent) => e.preventDefault()}
              sx={{ display: 'flex', gap: 1 }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Join
              </button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.800' }} />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} StepStyle India Pvt. Ltd. All rights reserved.
          </Typography>
          <Typography variant="body2" color="grey.500">
            Made with ❤️ in India | GST: 27AAAAA0000A1Z5
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
