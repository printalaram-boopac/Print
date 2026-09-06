import {
  Heart, Star, MapPin, Calendar, Camera, Quote, ArrowRight, Check, Phone, Mail,
  Globe, Instagram, Facebook, Linkedin, Link, Sparkles, Leaf, Sun, Moon, ImageOff,
  Flame, Award, ShoppingBag, Music, Coffee, Compass, Bookmark, Clock, Eye, Send,
  ThumbsUp, MessageCircle, Shield, Feather, Smile, Zap, Gift, Tag, Scissors, Bell,
  Crown, PartyPopper, Rocket, Lightbulb, BadgeCheck, Palette, Gem, Glasses,
  Umbrella, Ticket, Footprints, Anchor, Key, Plane, Wand2, Rainbow, Flower2,
  Cherry, Shirt, Watch, Wifi, Play, Volume2,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Star, MapPin, Calendar, Camera, Quote, ArrowRight, Check, Phone, Mail,
  Globe, Instagram, Facebook, Linkedin, Link, Sparkles, Leaf, Sun, Moon,
  Flame, Award, ShoppingBag, Music, Coffee, Compass, Bookmark, Clock, Eye, Send,
  ThumbsUp, MessageCircle, Shield, Feather, Smile, Zap, Gift, Tag, Scissors, Bell,
  Crown, PartyPopper, Rocket, Lightbulb, BadgeCheck, Palette, Gem, Glasses,
  Umbrella, Ticket, Footprints, Anchor, Key, Plane, Wand2, Rainbow, Flower2,
  Cherry, Shirt, Watch, Wifi, Play, Volume2,
};

export function iconFor(name: string | undefined): LucideIcon {
  return (name && ICON_MAP[name]) || ImageOff;
}
