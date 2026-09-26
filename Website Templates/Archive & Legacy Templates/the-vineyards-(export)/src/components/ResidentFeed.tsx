import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  User, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  BookOpen, 
  Search,
  Users,
  AlertCircle,
  Megaphone,
  Share2
} from 'lucide-react';
import { FeedItem } from '../types';

interface ResidentFeedProps {
  feedItems: FeedItem[];
  onUpdateFeedItem: (updated: FeedItem) => void;
}

export default function ResidentFeed({ feedItems, onUpdateFeedItem }: ResidentFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Comments temporary state per feed ID
  const [activeCommentsFeedId, setActiveCommentsFeedId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, Array<{ author: string, text: string, time: string }>>>({
    'f1': [
      { author: 'Maria Sterling', text: 'Stunning pool view this year. The clubhouse music matches perfectly.', time: '2 hours ago' },
      { author: 'Marcus Sterling', text: 'Unit 15 is going. Count us in for a table of 4.', time: '1 day ago' }
    ],
    'f2': [
      { author: 'Robert Ford', text: 'Thanks for the clean update. Will the EV charge station remain powered during sync?', time: '3 days ago' }
    ]
  });

  // Handle Like Increment
  const handleLike = (id: string) => {
    const targetItem = feedItems.find(item => item.id === id);
    if (!targetItem) return;

    const isLiked = targetItem.likedByUser;
    const updatedItem: FeedItem = {
      ...targetItem,
      likedByUser: !isLiked,
      likesCount: isLiked ? targetItem.likesCount - 1 : targetItem.likesCount + 1
    };

    onUpdateFeedItem(updatedItem);
  };

  // Handle RSVP Status Changes
  const handleRSVP = (id: string, status: FeedItem['rsvpStatus']) => {
    const targetItem = feedItems.find(item => item.id === id);
    if (!targetItem) return;

    const oldStatus = targetItem.rsvpStatus;
    let rsvpOffset = 0;

    if (oldStatus === null && status === 'Going') {
      rsvpOffset = 1;
    } else if (oldStatus === 'Going' && status !== 'Going') {
      rsvpOffset = -1;
    } else if (oldStatus !== 'Going' && status === 'Going') {
      rsvpOffset = 1;
    }

    const updatedItem: FeedItem = {
      ...targetItem,
      rsvpStatus: status,
      rsvpCount: targetItem.rsvpCount !== undefined ? targetItem.rsvpCount + rsvpOffset : undefined
    };

    onUpdateFeedItem(updatedItem);
  };

  // Handle adding comments
  const handleAddComment = (feedId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      author: 'Evelyn Vance (You)',
      text: newCommentText,
      time: 'Just now'
    };

    setCommentsMap({
      ...commentsMap,
      [feedId]: [...(commentsMap[feedId] || []), newComment]
    });

    // Update comment counter on feed item
    const targetItem = feedItems.find(item => item.id === feedId);
    if (targetItem) {
      onUpdateFeedItem({
        ...targetItem,
        commentsCount: targetItem.commentsCount + 1
      });
    }

    setNewCommentText('');
  };

  // Filters logic
  const filteredFeed = feedItems.filter(item => {
    const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white border border-[#EBE8E0] rounded-xl p-6 md:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE8E0]/60 pb-5">
        <div>
          <h3 className="font-serif text-xl font-medium text-[#121212] tracking-wide">
            Resident Chronicles & Notices
          </h3>
          <p className="font-sans text-xs text-stone-500 mt-1">
            Chronological updates, official files, and social events posted by community teams.
          </p>
        </div>

        {/* Categories selector */}
        <div className="flex flex-wrap gap-1.5 bg-[#FAF9F6] p-1 rounded-md border border-[#EBE8E0] self-start">
          {['All', 'Announcement', 'Event', 'Notice'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`text-[10px] uppercase font-semibold tracking-wider px-3 py-1.5 transition-all rounded-sm ${
                selectedFilter === cat
                  ? 'bg-white text-[#4A1521] shadow-2xs font-bold border-l-2 border-[#4A1521]'
                  : 'text-stone-500 hover:text-stone-900 border-l border-transparent'
              }`}
            >
              {cat === 'All' ? 'All Updates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search within chronicles archive..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs font-sans pl-10 pr-4 py-2.5 rounded border border-[#EBE8E0] bg-[#FAF9F6] focus:outline-hidden focus:border-[#4A1521] text-[#121212]"
        />
      </div>

      {/* Chronicles Stream List */}
      <div className="space-y-6">
        {filteredFeed.length === 0 ? (
          <div className="py-12 text-center text-stone-400 font-serif italic text-sm">
            No chronicles matches this filtration catalog.
          </div>
        ) : (
          filteredFeed.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const comments = commentsMap[item.id] || [];
            const isCommentsOpen = activeCommentsFeedId === item.id;

            return (
              <motion.article
                layout="position"
                key={item.id}
                className="group border border-[#EBE8E0] rounded-lg bg-white overflow-hidden transition-all duration-300 hover:border-stone-300"
              >
                {/* Image Section (Optional) */}
                {item.image && (
                  <div className="h-48 w-full overflow-hidden relative">
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-bold border ${
                        item.category === 'Event' ? 'bg-[#4A1521] text-white border-[#4A1521]' :
                        item.category === 'Announcement' ? 'bg-[#AF9E81] text-white border-[#AF9E81]' :
                        'bg-stone-900 text-white border-stone-900'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Info and Content */}
                <div className="p-6 space-y-4">
                  {!item.image && (
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border ${
                        item.category === 'Event' ? 'bg-[#4A1521]/10 text-[#4A1521] border-[#4A1521]/20' :
                        item.category === 'Announcement' ? 'bg-[#AF9E81]/10 text-[#AF9E81] border-[#AF9E81]/20' :
                        'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-[#AF9E81] uppercase tracking-widest block font-semibold">{item.date}</span>
                    <h4 className="font-serif text-lg text-stone-900 group-hover:text-[#4A1521] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="font-sans text-xs text-stone-500 leading-relaxed font-light">
                      {item.summary}
                    </p>
                  </div>

                  {/* Expanded full body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="font-sans text-xs text-stone-700 leading-relaxed space-y-4 pt-3 border-t border-[#EBE8E0]/60"
                      >
                        <p className="italic text-stone-600 bg-stone-50 p-3 rounded border-l-2 border-[#4A1521]/70">
                          {item.content}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-stone-400">
                          <span>Filing authority: <strong>{item.author}</strong></span>
                          <span>Bylaw Code Validation: Verified</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#EBE8E0]/50 text-xs font-sans">
                    <div className="flex items-center space-x-6">
                      {/* Likes Button */}
                      <button
                        onClick={() => handleLike(item.id)}
                        className={`flex items-center space-x-1.5 transition-colors ${
                          item.likedByUser ? 'text-[#4A1521] font-semibold' : 'text-stone-400 hover:text-[#4A1521]'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${item.likedByUser ? 'fill-current' : ''}`} />
                        <span className="font-mono text-[11px]">{item.likesCount}</span>
                      </button>

                      {/* Comments count Toggle */}
                      <button
                        onClick={() => setActiveCommentsFeedId(isCommentsOpen ? null : item.id)}
                        className={`flex items-center space-x-1.5 transition-colors ${
                          isCommentsOpen ? 'text-stone-900' : 'text-stone-400 hover:text-stone-900'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-mono text-[11px]">{comments.length}</span>
                      </button>

                      {/* Expand Button */}
                      <button
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="text-[#AF9E81] hover:text-[#4A1521] font-semibold flex items-center space-x-0.5"
                      >
                        {isExpanded ? (
                          <>
                            <span>Minimize Brief</span>
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <span>Expand Chronicle</span>
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-stone-400 font-mono italic hidden md:inline">Issued by {item.author}</span>
                    </div>
                  </div>

                  {/* Event RSVP Section (Only if category is Event) */}
                  {item.category === 'Event' && (
                    <div className="mt-3 p-4 bg-[#FAF9F6] border border-[#EBE8E0] rounded-md space-y-3 font-sans">
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-[#AF9E81]" />
                          <span className="text-stone-600">
                            Active Reservations: <strong className="font-mono font-bold text-stone-900">{item.rsvpCount}</strong> attending
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Social RSVP Registry</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mr-1">Your Attendance:</span>
                        {['Going', 'Maybe', 'Not Going'].map((status) => {
                          const isActive = item.rsvpStatus === status;
                          return (
                            <button
                              key={status}
                              onClick={() => handleRSVP(item.id, status as FeedItem['rsvpStatus'])}
                              className={`text-[10px] font-semibold px-2.5 py-1 transition-all rounded-xs border ${
                                isActive 
                                  ? 'bg-[#4A1521] text-white border-[#4A1521]' 
                                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Comments Panel */}
                  <AnimatePresence>
                    {isCommentsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 border-t border-[#EBE8E0]/60 space-y-4 font-sans text-xs"
                      >
                        {/* List Comments */}
                        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                          {comments.map((comment, index) => (
                            <div key={index} className="bg-stone-50 p-2.5 rounded border border-[#EBE8E0]/50">
                              <div className="flex justify-between items-center mb-1 text-[10px] text-stone-400 font-mono">
                                <span className="font-bold text-stone-700">{comment.author}</span>
                                <span>{comment.time}</span>
                              </div>
                              <p className="text-stone-600 text-[11px] leading-relaxed">{comment.text}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex items-center space-x-2">
                          <input
                            type="text"
                            required
                            placeholder="Add your note to the chronicle..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-1 p-2 border border-[#EBE8E0] bg-[#FAF9F6] text-xs rounded focus:outline-hidden focus:border-[#4A1521] text-stone-800"
                          />
                          <button
                            type="submit"
                            className="bg-stone-900 text-white font-serif tracking-wide hover:bg-black px-4 py-2 text-[11px] transition-colors shrink-0 rounded"
                          >
                            Post Brief
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </div>
  );
}
