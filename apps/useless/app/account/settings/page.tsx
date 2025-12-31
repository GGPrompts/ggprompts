'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  AlertTriangle,
  Volume2,
  Mail,
  Eye,
  EyeOff,
  Zap,
  Clock,
  Trash2,
  RefreshCw,
  Brain,
  Heart,
  Frown,
  Skull,
  Package,
  Save,
  Check,
  Paintbrush,
  Image,
  Video,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ggprompts/ui';
import { Button } from '@ggprompts/ui';
import { Switch } from '@ggprompts/ui';
import { Slider } from '@ggprompts/ui';
import { Label } from '@ggprompts/ui';
import { Input } from '@ggprompts/ui';
import { Separator } from '@ggprompts/ui';
import { RadioGroup, RadioGroupItem } from '@ggprompts/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ggprompts/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ggprompts/ui';
import { cn } from '@ggprompts/ui';
import { toast } from 'sonner';
import { useBackground, BackgroundType } from '@/components/background/BackgroundProvider';

type SettingsCategory = 'profile' | 'appearance' | 'preferences' | 'notifications' | 'privacy' | 'danger';

const categories = [
  { id: 'profile' as const, label: 'Profile', icon: User, sublabel: 'Basic identity crisis' },
  { id: 'appearance' as const, label: 'Appearance', icon: Paintbrush, sublabel: 'Lipstick on a pig' },
  { id: 'preferences' as const, label: 'Preferences', icon: Settings, sublabel: 'Customize your doom' },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell, sublabel: 'How we annoy you' },
  { id: 'privacy' as const, label: 'Privacy', icon: Shield, sublabel: 'Illusion of control' },
  { id: 'danger' as const, label: 'Danger Zone', icon: AlertTriangle, sublabel: 'Point of no return' },
];

const regretLabels = ['Mild Concern', 'Growing Doubt', 'Deep Regret', 'Existential Crisis', 'Complete Despair'];

const notificationSounds = [
  { value: 'sad-trombone', label: 'Sad Trombone', description: 'For purchase confirmations' },
  { value: 'cash-crying', label: 'Cash Register Crying', description: 'When your wallet weeps' },
  { value: 'ominous-whisper', label: 'Ominous Whisper', description: 'Low balance warnings' },
  { value: 'disappointed-sigh', label: 'Disappointed Sigh', description: 'Cart abandonment guilt' },
  { value: 'evil-laugh', label: 'Evil Laugh', description: 'Successful checkout' },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Background settings
  const {
    backgroundUrl,
    backgroundType,
    backgroundOpacity,
    setBackgroundUrl,
    setBackgroundType,
    setBackgroundOpacity,
    resetBackground,
  } = useBackground();
  const [urlInput, setUrlInput] = useState(backgroundUrl);

  // Sync urlInput when backgroundUrl loads from localStorage
  useEffect(() => {
    setUrlInput(backgroundUrl);
  }, [backgroundUrl]);

  // Profile state
  const [displayName, setDisplayName] = useState('Regretful Shopper');
  const [shameLevel, setShameLevel] = useState('medium');
  const [publicProfile, setPublicProfile] = useState(false);

  // Preferences state
  const [buyersRemorse, setBuyersRemorse] = useState(true);
  const [impulseMode, setImpulseMode] = useState(false);
  const [regretIntensity, setRegretIntensity] = useState([50]);
  const [judgmentalRecommendations, setJudgmentalRecommendations] = useState(true);
  const [shippingSpeed, setShippingSpeed] = useState('eventually');

  // Notification state
  const [spamDeals, setSpamDeals] = useState(true);
  const [passiveAggressiveReminders, setPassiveAggressiveReminders] = useState(true);
  const [weeklySavingsDigest, setWeeklySavingsDigest] = useState(false);
  const [mockingAlerts, setMockingAlerts] = useState(true);
  const [notificationSound, setNotificationSound] = useState('sad-trombone');

  // Privacy state
  const [shareDecisions, setShareDecisions] = useState('nobody');
  const [judgeBrowsing, setJudgeBrowsing] = useState(true);
  const [trackEmotions, setTrackEmotions] = useState(true);
  const [sellData, setSellData] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500));

    const funnyMessages = [
      "Settings saved! Your regrets have been noted.",
      "Preferences updated! We'll use them against you.",
      "Changes saved! No backsies.",
      "Configuration complete! The algorithm approves.",
      "Settings applied! Your therapist has been notified.",
      "Saved! These choices will haunt you forever.",
    ];

    toast.success(funnyMessages[Math.floor(Math.random() * funnyMessages.length)], {
      description: "Your settings have been preserved in our vault of questionable decisions.",
    });

    setIsSaving(false);
  };

  const handleDeleteHistory = () => {
    toast.success("Purchase history deleted!", {
      description: "The receipts are gone. The shame remains.",
    });
  };

  const handleResetBucks = () => {
    toast.success("UselessBucks reset to $0.00", {
      description: "Congratulations on your new poverty! Here's $1000 to start over.",
    });
  };

  const handleForgetEverything = () => {
    toast.success("Memory wipe initiated!", {
      description: "We've forgotten everything. JK, we have backups.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Inner Category Navigation */}
      <Card className="glass-dark border-primary/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                    "hover:bg-primary/10 text-sm font-medium",
                    isActive && "bg-primary/20 border border-primary/50 text-primary",
                    !isActive && "text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={cn(
                    "w-4 h-4",
                    category.id === 'danger' && "text-destructive"
                  )} />
                  <span className="hidden sm:inline">{category.label}</span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Profile Settings */}
          {activeCategory === 'profile' && (
            <>
              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Identity Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how others perceive your poor life choices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Anonymous Regretful Consumer"
                      className="glass"
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will appear on your Wall of Shame profile
                    </p>
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="space-y-2">
                    <Label>Public Shame Level</Label>
                    <Select value={shameLevel} onValueChange={setShameLevel}>
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - "I bought this ironically"</SelectItem>
                        <SelectItem value="medium">Medium - "It seemed like a good idea"</SelectItem>
                        <SelectItem value="high">High - "I have no excuse"</SelectItem>
                        <SelectItem value="maximum">Maximum - "I embrace my chaos"</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Determines how much judgment you receive from other users
                    </p>
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-xs text-muted-foreground">
                        Let strangers admire your purchasing decisions
                      </p>
                    </div>
                    <Switch
                      checked={publicProfile}
                      onCheckedChange={setPublicProfile}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive" />
                    Emotional Configuration
                  </CardTitle>
                  <CardDescription>
                    Fine-tune your shopping-induced feelings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Preferred Coping Mechanism</Label>
                    <Select defaultValue="retail">
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">More Retail Therapy</SelectItem>
                        <SelectItem value="denial">Complete Denial</SelectItem>
                        <SelectItem value="memes">Meme-Based Healing</SelectItem>
                        <SelectItem value="acceptance">Begrudging Acceptance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Appearance Settings */}
          {activeCategory === 'appearance' && (
            <>
              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Background Vibes
                  </CardTitle>
                  <CardDescription>
                    Distract yourself from the existential void with pretty pictures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Background Type</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'none' as const, label: 'None', icon: X, desc: 'Embrace the void' },
                        { value: 'image' as const, label: 'Image', icon: Image, desc: 'A picture is worth 1000 regrets' },
                        { value: 'video' as const, label: 'Video', icon: Video, desc: 'Moving pictures of despair' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setBackgroundType(opt.value)}
                          className={cn(
                            "flex-1 glass p-3 rounded-lg transition-all hover:border-glow",
                            backgroundType === opt.value && "bg-primary/20 border border-primary/50"
                          )}
                        >
                          <opt.icon className={cn(
                            "w-5 h-5 mx-auto mb-1",
                            backgroundType === opt.value ? "text-primary" : "text-muted-foreground"
                          )} />
                          <p className={cn(
                            "text-sm font-medium",
                            backgroundType === opt.value ? "text-primary" : "text-muted-foreground"
                          )}>{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {backgroundType !== 'none' && (
                    <>
                      <Separator className="bg-primary/20" />

                      <div className="space-y-2">
                        <Label htmlFor="bgUrl">
                          {backgroundType === 'image' ? 'Image' : 'Video'} URL
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="bgUrl"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder={`https://example.com/your-${backgroundType}.${backgroundType === 'image' ? 'jpg' : 'mp4'}`}
                            className="glass flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              setBackgroundUrl(urlInput);
                              toast.success("Background updated!", {
                                description: "Your aesthetic choices have been noted.",
                              });
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Paste a URL to an image or video. We won't judge. Much.
                        </p>
                      </div>

                      <Separator className="bg-primary/20" />

                      <div className="space-y-4">
                        <div className="space-y-0.5">
                          <Label className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Background Opacity
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            How visible should your questionable background choice be?
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Slider
                            value={[backgroundOpacity]}
                            onValueChange={(v) => setBackgroundOpacity(v[0])}
                            max={100}
                            min={5}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Barely There (5%)</span>
                            <span className="font-medium text-primary">{backgroundOpacity}%</span>
                            <span>Full Commitment (100%)</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {backgroundUrl && backgroundType !== 'none' && (
                    <>
                      <Separator className="bg-primary/20" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-destructive">Reset Background</Label>
                          <p className="text-xs text-muted-foreground">
                            Return to the comforting embrace of nothingness
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            resetBackground();
                            setUrlInput('');
                            toast.success("Background cleared!", {
                              description: "Back to basics. The void welcomes you.",
                            });
                          }}
                        >
                          Clear Background
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Paintbrush className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">Pro Tip</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        For the best experience, use low opacity (15-25%) so you can still see the products you'll regret buying.
                        High-resolution images work best. Video backgrounds may increase your existential dread.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Preferences Settings */}
          {activeCategory === 'preferences' && (
            <>
              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Shopping Psychology
                  </CardTitle>
                  <CardDescription>
                    Settings that will definitely not be used against you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Buyer's Remorse Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified 24 hours after purchase about your poor life choices
                      </p>
                    </div>
                    <Switch
                      checked={buyersRemorse}
                      onCheckedChange={setBuyersRemorse}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Impulse Purchase Mode
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Skip all confirmation dialogs. Live dangerously.
                      </p>
                    </div>
                    <Switch
                      checked={impulseMode}
                      onCheckedChange={(checked) => {
                        setImpulseMode(checked);
                        if (checked) {
                          toast.warning("Impulse mode activated!", {
                            description: "May your wallet have mercy on your soul.",
                          });
                        }
                      }}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Frown className="w-4 h-4" />
                        Regret Intensity
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        How much post-purchase guilt do you want to feel?
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Slider
                        value={regretIntensity}
                        onValueChange={setRegretIntensity}
                        max={100}
                        step={25}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {regretLabels.map((label, i) => (
                          <span
                            key={label}
                            className={cn(
                              "text-center",
                              regretIntensity[0] === i * 25 && "text-primary font-medium"
                            )}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Judgmental Product Recommendations
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Products will mock your previous purchases
                      </p>
                    </div>
                    <Switch
                      checked={judgmentalRecommendations}
                      onCheckedChange={setJudgmentalRecommendations}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Shipping Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how your useless items arrive (or don't)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingSpeed} onValueChange={setShippingSpeed} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="eventually" id="ship-eventually" />
                      <Label htmlFor="ship-eventually" className="flex-1 cursor-pointer">
                        <div className="glass p-4 rounded-lg hover:border-glow transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Eventually</p>
                              <p className="text-xs text-muted-foreground">
                                Arrives when it arrives. Maybe tomorrow, maybe next year.
                              </p>
                            </div>
                            <span className="text-sm font-bold text-green-500">FREE</span>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="probably-soon" id="ship-probably" />
                      <Label htmlFor="ship-probably" className="flex-1 cursor-pointer">
                        <div className="glass p-4 rounded-lg hover:border-glow transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Probably Soon</p>
                              <p className="text-xs text-muted-foreground">
                                We're pretty sure it'll get there. No promises though.
                              </p>
                            </div>
                            <span className="text-sm font-bold terminal-glow">$5.00</span>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="quantum" id="ship-quantum" />
                      <Label htmlFor="ship-quantum" className="flex-1 cursor-pointer">
                        <div className="glass p-4 rounded-lg hover:border-glow transition-all">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Quantum Delivery</p>
                              <p className="text-xs text-muted-foreground">
                                Already there, maybe. Don't open the box to find out.
                              </p>
                            </div>
                            <span className="text-sm font-bold terminal-glow">$20.00</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notification Settings */}
          {activeCategory === 'notifications' && (
            <>
              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Harassment Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how we clutter your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Spam Me With Deals I Don't Need</Label>
                      <p className="text-xs text-muted-foreground">
                        Daily emails about products that solve problems you don't have
                      </p>
                    </div>
                    <Switch
                      checked={spamDeals}
                      onCheckedChange={setSpamDeals}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Passive-Aggressive Cart Reminders</Label>
                      <p className="text-xs text-muted-foreground">
                        "Your cart misses you... why did you abandon it?"
                      </p>
                    </div>
                    <Switch
                      checked={passiveAggressiveReminders}
                      onCheckedChange={setPassiveAggressiveReminders}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest of Money You Could Have Saved</Label>
                      <p className="text-xs text-muted-foreground">
                        A painful reminder of all your frivolous spending
                      </p>
                    </div>
                    <Switch
                      checked={weeklySavingsDigest}
                      onCheckedChange={setWeeklySavingsDigest}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Product Mocking Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when products are laughing at you
                      </p>
                    </div>
                    <Switch
                      checked={mockingAlerts}
                      onCheckedChange={setMockingAlerts}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Notification Sounds
                  </CardTitle>
                  <CardDescription>
                    Choose how we aurally assault you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={notificationSound} onValueChange={setNotificationSound} className="space-y-3">
                    {notificationSounds.map((sound) => (
                      <div key={sound.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={sound.value} id={`sound-${sound.value}`} />
                        <Label htmlFor={`sound-${sound.value}`} className="flex-1 cursor-pointer">
                          <div className="glass p-3 rounded-lg hover:border-glow transition-all">
                            <p className="font-medium">{sound.label}</p>
                            <p className="text-xs text-muted-foreground">{sound.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </>
          )}

          {/* Privacy Settings */}
          {activeCategory === 'privacy' && (
            <>
              <Card className="glass-dark border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Privacy Theater
                  </CardTitle>
                  <CardDescription>
                    Settings that make you feel in control (you're not)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Share My Bad Decisions With</Label>
                    <Select value={shareDecisions} onValueChange={setShareDecisions}>
                      <SelectTrigger className="glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nobody">Nobody (we'll do it anyway)</SelectItem>
                        <SelectItem value="friends">Friends (so they can judge you)</SelectItem>
                        <SelectItem value="everyone">Everyone (embrace the chaos)</SelectItem>
                        <SelectItem value="enemies">My Enemies (assert dominance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Let Products Judge My Browsing History
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Products will form opinions about you based on what you've looked at
                      </p>
                    </div>
                    <Switch
                      checked={judgeBrowsing}
                      onCheckedChange={setJudgeBrowsing}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Track My Emotional State</Label>
                      <p className="text-xs text-muted-foreground">
                        We'll know exactly when you're vulnerable to impulse purchases
                      </p>
                    </div>
                    <Switch
                      checked={trackEmotions}
                      onCheckedChange={setTrackEmotions}
                    />
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sell My Data to the Highest Bidder</Label>
                      <p className="text-xs text-muted-foreground">
                        At least someone profits from your existence
                      </p>
                    </div>
                    <Switch
                      checked={sellData}
                      onCheckedChange={setSellData}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <EyeOff className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">Privacy Notice</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        These settings are purely decorative. We collect everything regardless of your preferences.
                        But it feels good to toggle switches, doesn't it?
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Danger Zone */}
          {activeCategory === 'danger' && (
            <Card className="glass-dark border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Skull className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Actions that sound scary but are mostly meaningless
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="glass p-4 rounded-lg border border-destructive/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2 text-destructive">
                        <Trash2 className="w-4 h-4" />
                        Delete Purchase History
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        The receipts disappear. The shame remains forever.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete History
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-overlay">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Purchase History?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will erase all records of your questionable purchases.
                            Your bank still knows. Your conscience still knows.
                            But at least we won't remind you.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep My Shame</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteHistory}>
                            Erase Evidence
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="glass p-4 rounded-lg border border-destructive/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2 text-destructive">
                        <RefreshCw className="w-4 h-4" />
                        Reset UselessBucks
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Why would you do this? You get $1000 free. This resets to $0.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Reset Balance
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-overlay">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset UselessBucks?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You currently have fake money. This will give you... less fake money.
                            Then we'll give you $1000 again because we're not monsters.
                            This entire action is pointless. Perfect for this site.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep My Fake Money</AlertDialogCancel>
                          <AlertDialogAction onClick={handleResetBucks}>
                            Reset to Poverty
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="glass p-4 rounded-lg border border-destructive/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2 text-destructive">
                        <Brain className="w-4 h-4" />
                        Forget Everything
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        We won't, though. We have backups. And memories. And grudges.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Factory Reset
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-overlay">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Forget Everything?</AlertDialogTitle>
                          <AlertDialogDescription>
                            We'll pretend we don't know you. You'll be a stranger again.
                            Like that time you ghosted someone, except it's a website.
                            We'll still recognize your IP though. We always do.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Stay Known</AlertDialogCancel>
                          <AlertDialogAction onClick={handleForgetEverything}>
                            Become Nobody
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="mt-6 p-4 glass rounded-lg border border-muted">
                  <p className="text-xs text-muted-foreground text-center italic">
                    "These buttons don't actually do much. But pressing them feels powerful, doesn't it?"
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isSaving ? "Saving your regrettable preferences..." : "Changes are not automatically saved"}
              </p>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="border-glow"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
