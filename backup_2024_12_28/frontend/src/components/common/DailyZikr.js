{/* Copy of your current DailyZikr.js */}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ADHKAR = [
  {
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    transliteration: "Subhan-Allahi wa bihamdihi",
    english: "Glory be to Allah and His is the praise",
    count: "100 times",
    virtue: "All sins will be forgiven even if they were like the foam of the sea",
    time: "morning"
  },
  {
    arabic: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullah wa atubu ilaih",
    english: "I seek Allah's forgiveness and turn to Him in repentance",
    count: "100 times",
    virtue: "Purifies the heart and brings forgiveness",
    time: "evening"
  },
  {
    arabic: "لا إلَهَ إلاّ اللّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallah wahdahu la shareeka lah, lahul mulku wa lahul hamd wa huwa 'ala kulli shay'in qadeer",
    english: "None has the right to be worshipped but Allah alone, Who has no partner. His is the dominion and His is the praise and He is Able to do all things",
    count: "100 times",
    virtue: "Equivalent to freeing ten slaves, a hundred good deeds are recorded, a hundred sins are removed",
    time: "morning"
  },
  {
    arabic: "لا حَوْلَ وَلا قُوَّةَ إِلا بِاللهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    english: "There is no might nor power except with Allah",
    count: "100 times",
    virtue: "A treasure from the treasures of Paradise",
    time: "any"
  },
  {
    arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    transliteration: "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
    english: "O Allah, send prayers and peace upon our Prophet Muhammad",
    count: "100 times",
    virtue: "Allah will send 1000 blessings upon you",
    time: "any"
  }
];

const DailyZikr = () => {
  const [zikr, setZikr] = useState(null);
  
  useEffect(() => {
    const currentHour = new Date().getHours();
    const timeOfDay = currentHour >= 5 && currentHour < 12 ? 'morning' : 'evening';
    
    // Filter adhkar based on time of day or 'any'
    const appropriateAdhkar = ADHKAR.filter(z => z.time === timeOfDay || z.time === 'any');
    const randomIndex = Math.floor(Math.random() * appropriateAdhkar.length);
    setZikr(appropriateAdhkar[randomIndex]);
  }, []);

  if (!zikr) return null;

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
          <AutoAwesomeIcon /> Daily Zikr
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "'Noto Naskh Arabic', serif",
              textAlign: 'center',
              direction: 'rtl',
              mb: 2,
              lineHeight: 1.8
            }}
          >
            {zikr.arabic}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              fontStyle: 'italic',
              mb: 1
            }}
          >
            {zikr.transliteration}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              mb: 2
            }}
          >
            {zikr.english}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          <Chip 
            label={zikr.count} 
            color="primary" 
            variant="outlined"
            size="small"
          />
          <Chip 
            label={zikr.time === 'any' ? 'Any Time' : `${zikr.time.charAt(0).toUpperCase() + zikr.time.slice(1)} Zikr`}
            color="success" 
            variant="outlined"
            size="small"
          />
        </Box>

        <Box sx={{ 
          borderTop: 1, 
          borderColor: 'divider', 
          pt: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            Virtue: {zikr.virtue}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailyZikr;
