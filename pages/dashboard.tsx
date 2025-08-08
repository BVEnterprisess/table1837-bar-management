import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Layout from '@/components/Layout/Layout'
import { supabase } from '@/lib/supabaseClient'
import type { Wine, Item86, HappyHourSpecial } from '@/types'
import { withAuth } from '@/components/Auth/withAuth'

function Dashboard() {
  const queryClient = useQueryClient()

  // Fetch featured wines
  const { data: featuredWines } = useQuery({
    queryKey: ['featured-wines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2)
      
      if (error) throw error
      return data as Wine[]
    },
  })

  // Fetch 86'd items
  const { data: items86 } = useQuery({
    queryKey: ['items-86'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items_86')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Item86[]
    },
  })

  // Fetch today's special
  const { data: todaySpecial } = useQuery({
    queryKey: ['today-special'],
    queryFn: async () => {
      const today = new Date().getDay()
      const { data, error } = await supabase
        .from('happy_hour_specials')
        .select('*')
        .eq('day_of_week', today)
        .eq('active', true)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data as HappyHourSpecial | null
    },
  })

  // Real-time subscriptions
  useEffect(() => {
    const items86Channel = supabase
      .channel('items_86_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'items_86' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['items-86'] })
          }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(items86Channel)
    }
  }, [queryClient])

  const getDefaultSpecial = () => {
    const today = new Date().getDay()
    const specials: Record<number, any> = {
      0: { // Sunday
        name: "Sunday Steak Night",
        description: "Garden Salad • Steak Frites • Glass of House Wine",
        price: "$40",
        time: "4p – 8p"
      },
      3: { // Wednesday
        name: "Date Night",
        description: "2-Dine for $89 • 3-Course Menu • $5 Draft Beer • $10 House Wine",
        price: "$89",
        time: "4p – 8p"
      },
      4: { // Thursday
        name: "1837 Bar & Burger Night",
        description: "$12.50 Signature Burger OR Crispy Chicken • $5 Draft Beer • $10 House Wine",
        price: "$12.50",
        time: "4p – 8p"
      },
      5: { // Friday
        name: "Late Night Happy Hour",
        description: "$5 Draft Beer • $10 House Wines • $10 House Winner Cocktails • $2 Off Curated Cocktails",
        price: "Various",
        time: "8p – 11p"
      },
      6: { // Saturday
        name: "Late Night Happy Hour",
        description: "$5 Draft Beer • $10 House Wines • $10 House Winner Cocktails • $2 Off Curated Cocktails",
        price: "Various",
        time: "8p – 11p"
      }
    }
    return specials[today] || null
  }

  const displaySpecial = todaySpecial || getDefaultSpecial()

  return (
    <Layout>
      <div className="dashboard-bg min-h-screen p-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Daily Dashboard</h2>
          
          {/* Featured Wines of the Week */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {featuredWines?.map((wine, index) => (
              <div key={wine.id} className="featured-wine">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <i className="fas fa-wine-glass-alt mr-2 text-yellow-400"></i>
                  Featured {index === 0 ? 'Red' : 'White'} Wine
                </h3>
                <p className="text-lg font-semibold">{wine.name}</p>
                <p className="text-gray-300">{wine.region}, {wine.vintage}</p>
                <p className="text-2xl font-bold text-yellow-400 mt-2">${wine.price}</p>
                {wine.code && <p className="text-sm text-gray-400">({wine.code})</p>}
              </div>
            )) || (
              // Default featured wines
              <>
                <div className="featured-wine">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <i className="fas fa-wine-glass-alt mr-2 text-yellow-400"></i>
                    Featured Red Wine
                  </h3>
                  <p className="text-lg font-semibold">CRISTOM, EILEEN VYD., PINOT NOIR</p>
                  <p className="text-gray-300">Eola-Amity Hills, Willamette Valley, OR, 2019</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">$185</p>
                  <p className="text-sm text-gray-400">(R013)</p>
                </div>
                
                <div className="featured-wine">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <i className="fas fa-wine-glass-alt mr-2 text-yellow-400"></i>
                    Featured White Wine
                  </h3>
                  <p className="text-lg font-semibold">NEYERS, CARNEROS CHARDONNAY</p>
                  <p className="text-gray-300">Sonoma County, CA, 2019</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">$100</p>
                  <p className="text-sm text-gray-400">(C004)</p>
                </div>
              </>
            )}
          </div>
          
          {/* 86'd Items Alert */}
          <div className="alert-86 mb-8">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              86'd Items
            </h3>
            <div>
              {items86 && items86.length > 0 ? (
                items86.map(item => (
                  <div key={item.id} className="mb-2">
                    <span className="font-semibold text-red-300">{item.name}</span>
                    <span className="text-sm text-gray-400 ml-2">- {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-300">No items currently 86'd</p>
              )}
            </div>
          </div>
          
          {/* Food Specials */}
          <div className="food-special-card mb-8">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <i className="fas fa-utensils mr-2 text-yellow-400"></i>
              Food Specials
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-yellow-400">Hors d'oeuvre</h4>
                <p className="text-gray-300">Salmon Tartare with Avocado Mousse</p>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400">Intermezzo</h4>
                <p className="text-gray-300">Lemon Basil Sorbet</p>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400">Soup of the Day</h4>
                <p className="text-gray-300">Wild Mushroom Bisque</p>
              </div>
            </div>
          </div>
          
          {/* Today's Special */}
          <div className="special-card">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <i className="fas fa-glass-martini mr-2 text-yellow-400"></i>
              Happy Hour Special
            </h3>
            <div>
              {displaySpecial ? (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold">{displaySpecial.name}</h4>
                    <span className="text-lg font-bold text-yellow-400">{displaySpecial.price}</span>
                  </div>
                  {displaySpecial.time && (
                    <p className="text-sm text-gray-400 mb-2">{displaySpecial.time}</p>
                  )}
                  <p className="text-gray-300">{displaySpecial.description}</p>
                </>
              ) : (
                <p className="text-gray-300">No special offerings today. Check back tomorrow!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Dashboard)