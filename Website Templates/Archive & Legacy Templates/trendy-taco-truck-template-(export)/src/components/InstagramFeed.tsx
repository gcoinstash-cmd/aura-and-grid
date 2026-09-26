import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Instagram, 
  Heart, 
  MessageCircle, 
  Grid, 
  Tv, 
  UserSquare2, 
  RotateCw, 
  X, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  date: string;
  type: 'image' | 'video' | 'carousel';
}

const INITIAL_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    caption: 'Slow-braised chipotle beef birria resting in rich consommé, seasoned with local farm cilantro and hand-pressed blue corn. 🌮🔥',
    likes: 342,
    comments: 28,
    tags: ['#WoodFired', '#Gastronomy', '#OaxacanSoul', '#LAMinimalist'],
    date: '2 hours ago',
    type: 'carousel'
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    caption: 'Stoking the flames. Our signature mesquite grills being prepped for tonight’s private estate wedding in Malibu. Cooking over live coals is an art of patience.',
    likes: 512,
    comments: 43,
    tags: ['#LiveFireCooking', '#MalibuWedding', '#CateringRigour'],
    date: '1 day ago',
    type: 'image'
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    caption: 'Charred octopus tentacles brushed with sweet agave guajillo glaze, paired with avocado lime mousse and heirloom radish disks.',
    likes: 289,
    comments: 19,
    tags: ['#PlatingArt', '#SeafoodGastronomy', '#AgaveMesa'],
    date: '3 days ago',
    type: 'image'
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    caption: 'Citrus-pickled cucumber salad with raw agave nectar drizzle and smoked salt flakes. Part of our seasonal botanic vegan options.',
    likes: 194,
    comments: 12,
    tags: ['#PlantBasedLuxury', '#FarmToTable', '#SummerMenu'],
    date: '4 days ago',
    type: 'image'
  },
  {
    id: 'post-5',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    caption: 'The warm glow of our curated design layout. We believe catering isn’t just food—it’s an environment, an editorial experience.',
    likes: 420,
    comments: 31,
    tags: ['#Tablescape', '#EventStyling', '#IntimateDinner'],
    date: '1 week ago',
    type: 'carousel'
  },
  {
    id: 'post-6',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    caption: 'Smoked agave botanical mocktails. Hand-shaken with freshly squeezed blood orange, sage-infused syrup, and a rosemary-charred sprig. 🍊🌿',
    likes: 311,
    comments: 22,
    tags: ['#Mixology', '#BotanicalSips', '#ZeroProof'],
    date: '1 week ago',
    type: 'video'
  }
];

const ALTERNATIVE_POSTS: InstagramPost[] = [
  {
    id: 'post-7',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    caption: 'Behind the scenes at LACMA Vernissage. Precision plating of custom duck carnitas with pickled pomegranate seeds.',
    likes: 458,
    comments: 39,
    tags: ['#ArtShowCatering', '#DuckCarnitas', '#GourmetCraft'],
    date: '30 seconds ago',
    type: 'image'
  },
  {
    id: 'post-8',
    imageUrl: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&q=80&w=800',
    caption: 'Charred sweet corn elote seasoned with smoked chipotle powder, cotija dust, and fresh lime zest. Real Southern Californian street ritual.',
    likes: 275,
    comments: 18,
    tags: ['#Elote', '#StreetFoodRitual', '#MexicanComfort'],
    date: '5 minutes ago',
    type: 'carousel'
  },
  {
    id: 'post-1',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    caption: 'Slow-braised chipotle beef birria resting in rich consommé, seasoned with local farm cilantro and hand-pressed blue corn. 🌮🔥',
    likes: 345,
    comments: 29,
    tags: ['#WoodFired', '#Gastronomy', '#OaxacanSoul'],
    date: '2 hours ago',
    type: 'carousel'
  },
  {
    id: 'post-2',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    caption: 'Stoking the flames. Our signature mesquite grills being prepped for tonight’s private estate wedding in Malibu.',
    likes: 516,
    comments: 44,
    tags: ['#LiveFireCooking', '#MalibuWedding'],
    date: '1 day ago',
    type: 'image'
  },
  {
    id: 'post-3',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    caption: 'Charred octopus tentacles brushed with sweet agave guajillo glaze, paired with avocado lime mousse.',
    likes: 293,
    comments: 20,
    tags: ['#PlatingArt', '#SeafoodGastronomy'],
    date: '3 days ago',
    type: 'image'
  },
  {
    id: 'post-5',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    caption: 'The warm glow of our curated design layout. We believe catering isn’t just food—it’s an environment.',
    likes: 425,
    comments: 32,
    tags: ['#Tablescape', '#EventStyling'],
    date: '1 week ago',
    type: 'carousel'
  }
];

export const InstagramFeed: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasRefreshed, setHasRefreshed] = useState<boolean>(false);

  const simulateFetchLatest = () => {
    setIsFetching(true);
    setTimeout(() => {
      setPosts(hasRefreshed ? INITIAL_POSTS : ALTERNATIVE_POSTS);
      setHasRefreshed(!hasRefreshed);
      setIsFetching(false);
    }, 900);
  };

  return (
    <div id="instagram-feed-section" className="space-y-8 mt-16 pt-16 border-t border-zinc-900 scroll-mt-24">
      
      {/* Grid Header / Editorial Profile Intro */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <span className="font-mono text-xs text-agave-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <Instagram className="w-3.5 h-3.5" />
            Social Dispatch
          </span>
          <h3 className="font-display font-medium text-3xl text-white mt-1">Inside Agave &amp; Mesa.</h3>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl">
            Live updates, behind-the-scenes prep videos, and spontaneous culinary stories directly from our Instagram feed.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={simulateFetchLatest}
            disabled={isFetching}
            className="px-4 py-2 bg-charcoal hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-agave-400' : ''}`} />
            {isFetching ? 'Fetching Feed...' : 'Sync Feed'}
          </button>
          
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-agave-950/40 hover:bg-agave-950/60 border border-agave-500/30 text-agave-400 hover:text-agave-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            Follow @agaveandmesa
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Styled Profile Card (Mocking Instagram Layout with Premium Styling) */}
      <div className="bg-charcoal/40 border border-zinc-850 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar frame */}
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-chipotle-500 via-amber-500 to-agave-400">
            <div className="w-16 h-16 rounded-full bg-obsidian flex items-center justify-center border-2 border-charcoal overflow-hidden p-0.5">
              <div className="w-full h-full rounded-full bg-agave-950 flex items-center justify-center text-white font-display font-bold text-lg">
                A&amp;M
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-chipotle-600 to-chipotle-400 text-white rounded-full p-1 border border-charcoal">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-sm font-semibold text-white">agaveandmesa</span>
              <span className="bg-agave-950/50 border border-agave-500/20 text-agave-400 text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold">
                Culinary Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans max-w-md">
              <span className="font-semibold text-zinc-300">Agave &amp; Mesa • Wood-Fired Gastronomy.</span> High-editorial catering, wood fire hearth rituals, &amp; fine Oaxacan comfort food commissions in Southern California.
            </p>
          </div>
        </div>

        {/* Profile Statistics Panel */}
        <div className="flex gap-8 border-t md:border-t-0 md:border-l border-zinc-850 pt-4 md:pt-0 md:pl-8 justify-around w-full md:w-auto">
          <div className="text-center">
            <span className="block text-sm font-bold text-white font-mono">148</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Posts</span>
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-white font-mono">12.4K</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-white font-mono">382</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">Following</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs mimicking Insta feed tabs */}
      <div className="flex justify-center border-b border-zinc-850 gap-8 text-xs font-mono">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'posts' ? 'border-agave-400 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          POSTS
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'reels' ? 'border-agave-400 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          REELS
        </button>
        <button
          onClick={() => setActiveTab('tagged')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'tagged' ? 'border-agave-400 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <UserSquare2 className="w-3.5 h-3.5" />
          TAGGED
        </button>
      </div>

      {/* Main Grid View */}
      {isFetching ? (
        // Elegant Skeleton Loader during mockup refresh
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="aspect-square bg-charcoal/60 border border-zinc-850 rounded-2xl animate-pulse flex flex-col justify-between p-4">
              <div className="w-12 h-2.5 bg-zinc-800 rounded" />
              <div className="space-y-2">
                <div className="h-3 bg-zinc-800 rounded w-5/6" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'posts' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <motion.div
              layoutId={`insta-post-${post.id}`}
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group aspect-square relative rounded-2xl overflow-hidden border border-zinc-850/80 bg-charcoal cursor-pointer"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Image element */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
              />

              {/* Elegant hover stats overlay */}
              <div className="absolute inset-0 bg-obsidian/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-white p-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 font-mono text-sm font-semibold">
                    <Heart className="w-4 h-4 text-chipotle-400 fill-chipotle-400" />
                    {post.likes}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-sm font-semibold">
                    <MessageCircle className="w-4 h-4 text-agave-400" />
                    {post.comments}
                  </div>
                </div>
                
                {/* Truncated caption snippet preview on hover */}
                <p className="text-[10px] text-zinc-300 text-center line-clamp-2 max-w-[80%] font-sans">
                  {post.caption}
                </p>
              </div>

              {/* Indicator icons (carousel/video) */}
              <div className="absolute top-3 right-3 bg-obsidian/85 border border-zinc-800 p-1.5 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                {post.type === 'carousel' && <Grid className="w-3.5 h-3.5" />}
                {post.type === 'video' && <Tv className="w-3.5 h-3.5" />}
                {post.type === 'image' && <Instagram className="w-3.5 h-3.5" />}
              </div>
            </motion.div>
          ))}
        </div>
      ) : activeTab === 'reels' ? (
        // Reels Tab Mock
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-zinc-850 bg-charcoal/20 rounded-2xl p-6 text-center space-y-4 py-16 col-span-2 md:col-span-4">
            <span className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
              <Tv className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">Culinary Process Reels</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Watch full high-definition clips of wood-charcoal hearth operations, slow smoking routines, and hand-mashing heirloom corn.
              </p>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-xs font-mono text-agave-400 hover:text-white underline cursor-pointer"
            >
              Launch Instagram to watch
            </a>
          </div>
        </div>
      ) : (
        // Tagged Tab Mock
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-zinc-850 bg-charcoal/20 rounded-2xl p-6 text-center space-y-4 py-16 col-span-2 md:col-span-4">
            <span className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
              <UserSquare2 className="w-5 h-5" />
            </span>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">Client Plating Captures</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Discover unedited stories and photo updates tagged by our event organizers, newlyweds, and dining guests.
              </p>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-xs font-mono text-agave-400 hover:text-white underline cursor-pointer"
            >
              View community mentions
            </a>
          </div>
        </div>
      )}

      {/* Lightbox / Post Detail Modal Overlay */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-obsidian/95 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              layoutId={`insta-post-${selectedPost.id}`}
              className="relative bg-charcoal border border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[680px]"
            >
              {/* Media Container (Left) */}
              <div className="md:col-span-7 bg-obsidian relative flex items-center justify-center overflow-hidden min-h-[280px] md:min-h-0">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Details & Mock Comments (Right) */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between h-full bg-charcoal">
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-850">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-agave-950 flex items-center justify-center text-agave-400 font-display font-bold text-xs border border-agave-500/20">
                        A&amp;M
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">agaveandmesa</span>
                        <span className="text-[9px] font-mono text-zinc-500">Downtown Los Angeles</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Caption & Tags */}
                  <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2 scrollbar-none">
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedPost.caption}
                    </p>
                    
                    {/* Hashtags list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-agave-400 hover:text-agave-300 cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-[9px] font-mono text-zinc-500 block uppercase pt-2">
                      {selectedPost.date}
                    </span>
                  </div>
                </div>

                {/* Engagement & CTAs Footer */}
                <div className="pt-4 border-t border-zinc-850 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-zinc-300 hover:text-chipotle-400 transition-colors font-mono text-xs">
                        <Heart className="w-4 h-4 text-chipotle-400 fill-chipotle-400" />
                        {selectedPost.likes}
                      </button>
                      <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs">
                        <MessageCircle className="w-4 h-4 text-agave-400" />
                        {selectedPost.comments}
                      </span>
                    </div>
                  </div>

                  {/* Mock Interactive Comment input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Add a comment as guest..."
                      disabled
                      className="w-full bg-zinc-900/50 border border-zinc-850 text-xs rounded-xl py-2 px-3 text-zinc-500 focus:outline-none placeholder-zinc-600"
                    />
                    <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-agave-400 opacity-60 pointer-events-none">
                      POST
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
