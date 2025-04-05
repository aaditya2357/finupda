import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../context/AuthContext';
import { saveFinancialGoal } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { FinancialGoal } from '../types';

const FinancialGoalsCard = () => {
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goals, setGoals] = useState<FinancialGoal[]>(userProfile?.goals || [
    {
      id: '1',
      name: 'Retirement Fund',
      targetAmount: 25000000,
      currentAmount: 5820000,
      targetDate: new Date('2045-01-01'),
      category: 'retirement',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Home Purchase',
      targetAmount: 6500000,
      currentAmount: 3250000,
      targetDate: new Date('2026-01-01'),
      category: 'housing',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Travel Fund',
      targetAmount: 500000,
      currentAmount: 120000,
      targetDate: new Date('2025-01-01'),
      category: 'travel',
      createdAt: new Date()
    }
  ]);
  
  // Form state for adding new goal
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetYear: new Date().getFullYear() + 5,
    category: 'other'
  });

  // Handle add goal dialog
  const openAddGoalDialog = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to add financial goals",
        variant: "destructive"
      });
      return;
    }
    setIsAddGoalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (field: string, value: string | number) => {
    setNewGoal({
      ...newGoal,
      [field]: value
    });
  };

  // Handle goal submission
  const handleSubmitGoal = async () => {
    if (!newGoal.name || newGoal.targetAmount <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const goalToSave = {
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.currentAmount,
      targetDate: new Date(`${newGoal.targetYear}-01-01`),
      category: newGoal.category,
      createdAt: new Date()
    } as FinancialGoal;

    try {
      if (currentUser) {
        await saveFinancialGoal(currentUser.uid, goalToSave);
      }
      
      setGoals([...goals, goalToSave]);
      setIsAddGoalOpen(false);
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        targetYear: new Date().getFullYear() + 5,
        category: 'other'
      });
      
      toast({
        title: "Goal added",
        description: "Your financial goal has been successfully added"
      });
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Error",
        description: "Failed to save your goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper to get progress percentage
  const getProgressPercentage = (current: number, target: number) => {
    return Math.round((current / target) * 100);
  };

  // Helper to get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'retirement':
        return 'bg-green-500';
      case 'housing':
        return 'bg-blue-500';
      case 'education':
        return 'bg-yellow-500';
      case 'travel':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Your Financial Goals</h3>
          <Button 
            variant="ghost"
            className="text-primary hover:text-primary-light transition-colors"
            onClick={openAddGoalDialog}
          >
            <i className="fas fa-plus mr-2"></i> Add Goal
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4 relative">
              {goal.id === '1' && (
                <div className="absolute top-3 right-3 text-yellow-500">
                  <i className="fas fa-star"></i>
                </div>
              )}
              <h4 className="font-medium mb-2">{goal.name}</h4>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-light">Target</span>
                <span>₹{(goal.targetAmount / 100000).toFixed(1)} {goal.targetAmount >= 10000000 ? 'Cr' : 'L'}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-text-light">Current</span>
                <span>
                  ₹{(goal.currentAmount / 100000).toFixed(1)} {goal.currentAmount >= 10000000 ? 'Cr' : 'L'} 
                  ({getProgressPercentage(goal.currentAmount, goal.targetAmount)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`${getCategoryColor(goal.category)} h-2 rounded-full`} 
                  style={{ width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%` }}
                ></div>
              </div>
              <div className={`text-xs ${goal.id === '3' ? 'text-red-500' : 'text-text-light'}`}>
                {goal.id === '3' ? 'Behind schedule' : 'On track'} • Est. completion by {goal.targetDate.getFullYear()}
              </div>
            </div>
          ))}
          
          {goals.length === 0 && (
            <div className="col-span-3 text-center py-6 text-gray-500">
              <i className="fas fa-flag text-3xl mb-2"></i>
              <p>You don't have any financial goals yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={openAddGoalDialog}
              >
                <i className="fas fa-plus mr-2"></i> Add Your First Goal
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Financial Goal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium block mb-1">Goal Name</label>
              <Input 
                value={newGoal.name} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. New Car, Education Fund"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Target Amount (₹)</label>
              <Input 
                type="number" 
                value={newGoal.targetAmount || ''} 
                onChange={(e) => handleInputChange('targetAmount', parseInt(e.target.value))}
                placeholder="1000000"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Current Amount (₹)</label>
              <Input 
                type="number" 
                value={newGoal.currentAmount || ''} 
                onChange={(e) => handleInputChange('currentAmount', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Target Year</label>
              <Input 
                type="number" 
                value={newGoal.targetYear || ''} 
                onChange={(e) => handleInputChange('targetYear', parseInt(e.target.value))}
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 50}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Category</label>
              <Select 
                value={newGoal.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retirement">Retirement</SelectItem>
                  <SelectItem value="housing">Housing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitGoal}>
                Add Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialGoalsCard;
