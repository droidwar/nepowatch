'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { getUserIdentity } from "@/lib/deviceId";
import { event } from "@/lib/gtag";

interface VoteButtonsProps {
  targetId: string;
  targetType: 'post' | 'comment';
  upvotes: number;
  downvotes: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VoteButtons({ 
  targetId, 
  targetType, 
  upvotes, 
  downvotes, 
  size = 'md',
  className = '' 
}: VoteButtonsProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
  const [isLoading, setIsLoading] = useState(false);
  const [userIdentity] = useState(() => getUserIdentity());

  const sizeConfig = {
    sm: { buttonClass: 'p-1 h-6 w-6', iconClass: 'w-3 h-3', textClass: 'text-xs' },
    md: { buttonClass: 'p-1 h-8 w-8', iconClass: 'w-4 h-4', textClass: 'text-sm' },
    lg: { buttonClass: 'p-2 h-10 w-10', iconClass: 'w-5 h-5', textClass: 'text-base' }
  };

  const config = sizeConfig[size];

  useEffect(() => {
    // Load user's existing vote
    const loadUserVote = async () => {
      try {
        const votesQuery = query(
          collection(db, 'votes'),
          where('userId', '==', userIdentity.id),
          where('targetId', '==', targetId),
          where('targetType', '==', targetType)
        );
        
        const querySnapshot = await getDocs(votesQuery);
        if (!querySnapshot.empty) {
          const voteDoc = querySnapshot.docs[0];
          setUserVote(voteDoc.data().voteType);
        }
      } catch (error) {
        console.error('Error loading user vote:', error);
      }
    };

    loadUserVote();
  }, [targetId, targetType, userIdentity.id]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      // Check for existing vote
      const votesQuery = query(
        collection(db, 'votes'),
        where('userId', '==', userIdentity.id),
        where('targetId', '==', targetId),
        where('targetType', '==', targetType)
      );
      
      const existingVotes = await getDocs(votesQuery);
      const existingVote = existingVotes.docs[0];

      // Determine the action
      let action: 'add' | 'remove' | 'change' = 'add';
      let oldVoteType: 'up' | 'down' | null = null;

      if (existingVote) {
        oldVoteType = existingVote.data().voteType;
        if (oldVoteType === voteType) {
          action = 'remove';
        } else {
          action = 'change';
        }
      }

      // Update local state optimistically
      let newUpvotes = currentUpvotes;
      let newDownvotes = currentDownvotes;

      if (action === 'add') {
        if (voteType === 'up') {
          newUpvotes += 1;
        } else {
          newDownvotes += 1;
        }
        setUserVote(voteType);
      } else if (action === 'remove') {
        if (voteType === 'up') {
          newUpvotes -= 1;
        } else {
          newDownvotes -= 1;
        }
        setUserVote(null);
      } else if (action === 'change') {
        if (oldVoteType === 'up') {
          newUpvotes -= 1;
          newDownvotes += 1;
        } else {
          newDownvotes -= 1;
          newUpvotes += 1;
        }
        setUserVote(voteType);
      }

      setCurrentUpvotes(newUpvotes);
      setCurrentDownvotes(newDownvotes);

      // Update database
      if (action === 'remove') {
        // Remove vote
        await deleteDoc(existingVote.ref);
        
        // Update target document
        const targetCollection = targetType === 'post' ? 'posts' : 'comments';
        const updateData = voteType === 'up' ? 
          { upvotes: increment(-1) } : 
          { downvotes: increment(-1) };
        
        await updateDoc(doc(db, targetCollection, targetId), updateData);
        
      } else if (action === 'add') {
        // Add new vote
        await addDoc(collection(db, 'votes'), {
          userId: userIdentity.id,
          targetId,
          targetType,
          voteType,
          createdAt: new Date(),
        });
        
        // Update target document
        const targetCollection = targetType === 'post' ? 'posts' : 'comments';
        const updateData = voteType === 'up' ? 
          { upvotes: increment(1) } : 
          { downvotes: increment(1) };
        
        await updateDoc(doc(db, targetCollection, targetId), updateData);
        
      } else if (action === 'change') {
        // Update existing vote
        await updateDoc(existingVote.ref, { voteType });
        
        // Update target document (remove old, add new)
        const targetCollection = targetType === 'post' ? 'posts' : 'comments';
        const updateData = oldVoteType === 'up' ? 
          { upvotes: increment(-1), downvotes: increment(1) } : 
          { upvotes: increment(1), downvotes: increment(-1) };
        
        await updateDoc(doc(db, targetCollection, targetId), updateData);
      }

      // Track voting action
      event({
        action: `${targetType}_vote`,
        category: 'engagement',
        label: `${voteType}_vote`
      });

    } catch (error) {
      console.error('Error handling vote:', error);
      
      // Revert optimistic updates on error
      setCurrentUpvotes(upvotes);
      setCurrentDownvotes(downvotes);
      
      // Reload user vote state
      const votesQuery = query(
        collection(db, 'votes'),
        where('userId', '==', userIdentity.id),
        where('targetId', '==', targetId),
        where('targetType', '==', targetType)
      );
      
      const querySnapshot = await getDocs(votesQuery);
      if (!querySnapshot.empty) {
        const voteDoc = querySnapshot.docs[0];
        setUserVote(voteDoc.data().voteType);
      } else {
        setUserVote(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const score = currentUpvotes - currentDownvotes;

  return (
    <div className={`flex flex-col items-center space-y-1 ${className}`}>
      <Button 
        variant={userVote === 'up' ? 'default' : 'ghost'}
        size="sm" 
        className={`${config.buttonClass} ${userVote === 'up' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
        onClick={() => handleVote('up')}
        disabled={isLoading}
      >
        <ArrowUp className={config.iconClass} />
      </Button>
      
      <span className={`font-medium ${config.textClass} ${
        score > 0 ? 'text-orange-600' : 
        score < 0 ? 'text-blue-600' : 
        'text-muted-foreground'
      }`}>
        {score}
      </span>
      
      <Button 
        variant={userVote === 'down' ? 'default' : 'ghost'}
        size="sm" 
        className={`${config.buttonClass} ${userVote === 'down' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
        onClick={() => handleVote('down')}
        disabled={isLoading}
      >
        <ArrowDown className={config.iconClass} />
      </Button>
    </div>
  );
}