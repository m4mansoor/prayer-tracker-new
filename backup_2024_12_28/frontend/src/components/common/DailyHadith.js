{/* Copy of your current DailyHadith.js */}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const HADITHS = [
  {
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are judged by intentions, and each person will be rewarded according to their intentions.",
    reference: "Sahih al-Bukhari 1"
  },
  {
    arabic: "مَنْ حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ",
    english: "Whoever maintains four rak'ahs before Dhuhr prayer and four after it, Allah will forbid him from the Fire.",
    reference: "Sunan al-Tirmidhi 428"
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    english: "Cleanliness is half of faith.",
    reference: "Sahih Muslim 223"
  },
  {
    arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",
    english: "Whoever fasts during Ramadan out of sincere faith and hoping to attain Allah's rewards, then all his past sins will be forgiven.",
    reference: "Sahih al-Bukhari 38"
  },
  {
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    english: "Supplication is worship.",
    reference: "Sunan Abi Dawud 1479"
  }
];

const DailyHadith = () => {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get a random hadith from our collection
    const randomIndex = Math.floor(Math.random() * HADITHS.length);
    setHadith(HADITHS[randomIndex]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card sx={{ 
        width: '100%', 
        mb: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: 2,
      }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      width: '100%', 
      mb: 3,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: 2,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
        borderRadius: '4px 4px 0 0',
      },
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormatQuoteIcon /> Daily Hadith
        </Typography>
        
        {hadith && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: "'Noto Naskh Arabic', serif",
                  fontSize: '1.2rem',
                  textAlign: 'right',
                  direction: 'rtl',
                  mb: 2,
                  lineHeight: 1.8
                }}
              >
                {hadith.arabic}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {hadith.english}
              </Typography>
            </Box>
            
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Reference: {hadith.reference}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyHadith;
