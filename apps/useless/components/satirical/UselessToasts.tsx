'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Fake cities for "Someone just bought" notifications
const FAKE_CITIES = [
  'Atlantis',
  'Mordor',
  'Gotham City',
  'Bikini Bottom',
  'Springfield',
  'Narnia',
  'Hogwarts',
  'The Moon',
  "Your Mom's House",
  'Area 51',
  'Wakanda',
  'The Upside Down',
  'Tatooine',
  'The Shire',
  'Asgard',
  'Neverland',
];

// Fake products for "Someone just bought" notifications
const FAKE_PRODUCTS = [
  'Self-Aware Toaster',
  'WiFi Rock',
  'Invisible Ink',
  'Waterproof Tea Bag',
  'Silent Alarm Clock',
  'Decaf Coffee-Flavored Water',
  'Bluetooth Candle',
  'Organic Air',
  'Solar-Powered Flashlight',
  'Inflatable Dartboard',
  'Fireproof Matches',
  'Submarine Screen Door',
  'Ejection Seat for Helicopter',
  'Dehydrated Water',
];

// Toast message configurations
type ToastConfig = {
  message: string;
  description?: string;
  type: 'default' | 'success' | 'warning' | 'error' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
};

const getRandomElement = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate dynamic toast messages
const generateToastConfigs = (): ToastConfig[] => {
  const city = getRandomElement(FAKE_CITIES);
  const product = getRandomElement(FAKE_PRODUCTS);
  const scrollCount = getRandomNumber(1, 47);
  const certaintyPercent = getRandomNumber(12, 94);
  const uselessBucksAmount = getRandomNumber(100, 9999);

  return [
    {
      message: 'Your cart misses you. It\'s been crying.',
      description: 'We heard sobbing sounds from the backend.',
      type: 'warning',
      action: {
        label: 'Console it',
        onClick: () => toast('The cart feels slightly better now.'),
      },
    },
    {
      message: 'A product is feeling neglected. Visit it?',
      description: 'The WiFi Rock has been staring at the wall.',
      type: 'info',
      action: {
        label: 'Ignore (mean)',
        onClick: () => toast.error('The product will remember this.'),
      },
    },
    {
      message: 'UselessBucks reminder: This is not real money.',
      description: `You have ${uselessBucksAmount.toLocaleString()} UselessBucks. Still worthless.`,
      type: 'info',
    },
    {
      message: `Someone in ${city} just bought ${product}!`,
      description: 'They seem very happy about their terrible decision.',
      type: 'success',
    },
    {
      message: 'Your session has been terminated.',
      description: 'Just kidding. We would never.',
      type: 'error',
      duration: 3000,
    },
    {
      message: `We're ${certaintyPercent}% sure this site works.`,
      description: 'The other percentage is vibes.',
      type: 'default',
    },
    {
      message: `Fun fact: You've scrolled past ${scrollCount} useless products.`,
      description: 'Each one judged you silently.',
      type: 'info',
    },
    {
      message: 'URGENT: Our hamster powering the servers needs a break.',
      description: 'Please browse 20% slower.',
      type: 'warning',
      action: {
        label: 'Send treats',
        onClick: () => toast.success('Hamster morale increased by 0.01%'),
      },
    },
    {
      message: 'Congratulations! You\'ve won nothing!',
      description: 'Claim your prize by doing absolutely nothing.',
      type: 'success',
      action: {
        label: 'Claim nothing',
        onClick: () => toast('You now own nothing. Congratulations!'),
      },
    },
    {
      message: 'This toast was sponsored by itself.',
      description: 'Meta-advertising at its finest.',
      type: 'default',
    },
    {
      message: 'Error 418: I\'m a teapot.',
      description: 'We\'re legally required to show this.',
      type: 'error',
    },
    {
      message: 'Your data is being sold.',
      description: 'Just kidding! ...or are we?',
      type: 'warning',
      action: {
        label: 'Check privacy',
        onClick: () => toast('Our privacy policy is written in invisible ink.'),
      },
    },
    {
      message: 'The void has noticed you browsing.',
      description: 'It approves of your purchase decisions.',
      type: 'default',
    },
    {
      message: 'Did you know? None of our products do anything.',
      description: 'That\'s the point. You\'re welcome.',
      type: 'info',
    },
    {
      message: 'System update: Still useless',
      description: 'All systems nominal. Zero functionality maintained.',
      type: 'success',
    },
    {
      message: 'Achievement unlocked: Waste of Time',
      description: 'You\'ve been here for too long.',
      type: 'success',
      action: {
        label: 'View trophy',
        onClick: () => toast('The trophy is also invisible.'),
      },
    },
    {
      message: 'Breaking: Local user still hasn\'t bought anything',
      description: 'Our products are judging you.',
      type: 'warning',
    },
    {
      message: 'Hot tip: Refreshing won\'t make the products useful.',
      description: 'We\'ve tried. Many times.',
      type: 'info',
    },
    {
      message: 'Server hamster update:',
      description: 'Mr. Whiskers is on his 47th coffee break.',
      type: 'default',
    },
    {
      message: 'FLASH SALE: Everything is still useless!',
      description: '100% off usefulness. Limited time only.',
      type: 'success',
      action: {
        label: 'Shop now',
        onClick: () => toast('The sale has ended. It was 0.3 seconds.'),
      },
    },
    {
      message: 'Your browser is feeling self-conscious.',
      description: 'It knows you have other browsers.',
      type: 'warning',
    },
    {
      message: 'Fact check: This notification is real.',
      description: 'Unlike our products.',
      type: 'info',
    },
    {
      message: 'Loading... just kidding, we loaded ages ago.',
      description: 'We just wanted to feel important.',
      type: 'default',
    },
    {
      message: `${product} is trending!`,
      description: `${getRandomNumber(2, 99)} people are looking at this. They need help.`,
      type: 'info',
    },
    {
      message: 'Your wallet breathed a sigh of relief.',
      description: 'You almost bought something useless.',
      type: 'success',
    },
  ];
};

// Show a toast based on config
const showToast = (config: ToastConfig) => {
  const toastOptions = {
    description: config.description,
    duration: config.duration || 5000,
    action: config.action
      ? {
          label: config.action.label,
          onClick: config.action.onClick,
        }
      : undefined,
  };

  switch (config.type) {
    case 'success':
      toast.success(config.message, toastOptions);
      break;
    case 'error':
      toast.error(config.message, toastOptions);
      break;
    case 'warning':
      toast.warning(config.message, toastOptions);
      break;
    case 'info':
      toast.info(config.message, toastOptions);
      break;
    default:
      toast(config.message, toastOptions);
  }
};

export function UselessToasts() {
  const showRandomToast = useCallback(() => {
    const configs = generateToastConfigs();
    const randomConfig = getRandomElement(configs);
    showToast(randomConfig);
  }, []);

  useEffect(() => {
    // Show first toast after a delay (not immediately on page load)
    const initialDelay = getRandomNumber(15000, 30000); // 15-30 seconds

    const initialTimeout = setTimeout(() => {
      showRandomToast();

      // Then set up recurring interval
      const showNextToast = () => {
        const delay = getRandomNumber(30000, 90000); // 30-90 seconds
        return setTimeout(() => {
          showRandomToast();
          // Schedule next toast recursively for truly random intervals
          timeoutId = showNextToast();
        }, delay);
      };

      timeoutId = showNextToast();
    }, initialDelay);

    let timeoutId: NodeJS.Timeout;

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showRandomToast]);

  // This component doesn't render anything visible
  return null;
}

export default UselessToasts;
