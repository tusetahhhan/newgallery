const { useState, useEffect } = React;

const API_URL = 'https://gallerysite-production.up.railway.app/api';

function App() {
    const [currentView, setCurrentView] = useState('upload');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [critique, setCritique] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [archive, setArchive] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [saving, setSaving] = useState(false);
    
    // Auction states
    const [selectedForAuction, setSelectedForAuction] = useState([]);
    const [auctionSetup, setAuctionSetup] = useState(false);
    const [auctionLive, setAuctionLive] = useState(false);
    const [currentAuctionWork, setCurrentAuctionWork] = useState(null);
    const [auctionIndex, setAuctionIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [startingPrices, setStartingPrices] = useState({});
    const [auctionResults, setAuctionResults] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [autoBidInterval, setAutoBidInterval] = useState(null);
    
    // Gallery wall system
    const [galleryView, setGalleryView] = useState(true);
    const [galleryWalls, setGalleryWalls] = useState(() => {
        const saved = localStorage.getItem('galleryWalls');
        return saved ? JSON.parse(saved) : [];
    });
    const [showArtMarket, setShowArtMarket] = useState(false);
    const [selectedWallSlot, setSelectedWallSlot] = useState(null);
    const [showArtworkActions, setShowArtworkActions] = useState(false);
    const [selectedPurchasedArt, setSelectedPurchasedArt] = useState(null);
    
    // Fake art pieces
    const fakeArtPieces = [
        { 
            title: "Sunset Over Mountains", 
            artist: "Generic Landscapes Inc.", 
            price: 5000, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ff6b6b' width='400' height='300'/%3E%3Crect fill='%23ffa500' x='0' y='200' width='400' height='100'/%3E%3Ccircle fill='%23ffeb3b' cx='100' cy='100' r='50'/%3E%3C/svg%3E"
        },
        { 
            title: "Abstract Composition #42", 
            artist: "AI Art Studio", 
            price: 3000, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%234ecdc4' width='400' height='300'/%3E%3Ccircle fill='%23ffe66d' cx='200' cy='150' r='80'/%3E%3Crect fill='%23ff6b6b' x='50' y='50' width='100' height='100' transform='rotate(45 100 100)'/%3E%3C/svg%3E"
        },
        { 
            title: "Still Life with Fruit", 
            artist: "Classical Reproductions", 
            price: 4000, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ffe66d' width='400' height='300'/%3E%3Cellipse fill='%23ff6347' cx='150' cy='150' rx='60' ry='70'/%3E%3Cellipse fill='%23ffa500' cx='250' cy='160' rx='50' ry='60'/%3E%3Crect fill='%238b4513' x='100' y='200' width='200' height='20'/%3E%3C/svg%3E"
        },
        { 
            title: "Urban Street Scene", 
            artist: "Stock Photo Gallery", 
            price: 3500, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23a8e6cf' width='400' height='300'/%3E%3Crect fill='%23696969' x='50' y='100' width='80' height='150'/%3E%3Crect fill='%23696969' x='150' y='80' width='100' height='170'/%3E%3Crect fill='%23696969' x='270' y='120' width='80' height='130'/%3E%3Crect fill='%23333' x='0' y='250' width='400' height='50'/%3E%3C/svg%3E"
        },
        { 
            title: "Portrait of Anonymous", 
            artist: "Digital Art Collective", 
            price: 6000, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ff8b94' width='400' height='300'/%3E%3Cellipse fill='%23ffd3b6' cx='200' cy='130' rx='70' ry='90'/%3E%3Ccircle fill='%23333' cx='180' cy='120' r='8'/%3E%3Ccircle fill='%23333' cx='220' cy='120' r='8'/%3E%3Crect fill='%23ffa07a' x='150' y='200' width='100' height='80'/%3E%3C/svg%3E"
        },
        { 
            title: "Geometric Patterns", 
            artist: "Modern Design Co.", 
            price: 2500, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ffd3b6' width='400' height='300'/%3E%3Crect fill='%234ecdc4' x='50' y='50' width='100' height='100'/%3E%3Crect fill='%23ff6b6b' x='250' y='50' width='100' height='100'/%3E%3Crect fill='%23ffe66d' x='150' y='150' width='100' height='100'/%3E%3C/svg%3E"
        },
        { 
            title: "Seascape at Dawn", 
            artist: "Nature Prints Ltd.", 
            price: 4500, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%2387ceeb' width='400' height='200'/%3E%3Crect fill='%231e90ff' y='150' width='400' height='150'/%3E%3Ccircle fill='%23ffd700' cx='350' cy='50' r='40'/%3E%3Cpath fill='%23f0e68c' d='M 0 200 Q 100 180 200 200 T 400 200 L 400 300 L 0 300 Z'/%3E%3C/svg%3E"
        },
        { 
            title: "Minimalist Study", 
            artist: "Concept Art Group", 
            price: 3000, 
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f7f7f7' width='400' height='300'/%3E%3Cline x1='100' y1='50' x2='300' y2='50' stroke='%23333' stroke-width='4'/%3E%3Ccircle fill='none' stroke='%23333' stroke-width='3' cx='200' cy='150' r='60'/%3E%3Crect fill='%23333' x='180' y='220' width='40' height='40'/%3E%3C/svg%3E"
        },
    ];
    
    const bidderNames = [
        "Anonymous Collector", "Margaux T.", "Dr. K. Holmquist", "Y. Benveniste Foundation",
        "Private Swiss Buyer", "Museum Acquisitions", "L. Vermeer Trust", "Institutional Buyer",
        "D. Kostas Collection", "Anonymous Phone Bidder", "Online Bidder 47", "Gallery Representative"
    ];
    
    const [galleryFunds, setGalleryFunds] = useState(() => {
        const saved = localStorage.getItem('galleryFunds');
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('galleryFunds', galleryFunds.toString());
    }, [galleryFunds]);

    useEffect(() => {
        localStorage.setItem('galleryWalls', JSON.stringify(galleryWalls));
    }, [galleryWalls]);

    const critiqueTemplates = {
        titleTemplates: [
            "Interval Between Surfaces", "The Perpetual Threshold", "Moment of Recursive Absence",
            "Fragmented Continuity #7", "Study in Temporal Displacement", "The Weight of Empty Gestures",
            "Archaeology of the Present", "Liminal Object (Untitled)", "Recursive Negation Series", "Document of Impossibility"
        ],
        artistTemplates: [
            "Margaux Thelin", "Kasper Holmquist", "Yara Benveniste", "Sven Kjelland", "Lucia Vermeer",
            "Dimitri Kostas", "Ingrid Sørensen", "Felix Aguirre", "Maris Hendriksen", "Lars Bergman"
        ],
        mediumTemplates: [
            "Acrylic and coffee grounds on linen", "Digital print on salvaged aluminum", "Tempera and zinc oxide on reclaimed billboard",
            "Oil and graphite on unstretched canvas", "Mixed media with industrial felt and resin", "Inkjet on architectural mylar",
            "Encaustic and rust on birch panel", "Screenprint on deconstructed textile", "Charcoal and interference pigment on paper",
            "Found object with epoxy resin"
        ],
        labelTemplates: [
            "This work interrogates the phenomenology of domestic ephemera through a lens of post-structural ambivalence.",
            "Employing a methodology of deliberate mis-registration, the work exists in productive tension between legibility and opacity.",
            "The piece operates within a framework of radical banality, foregrounding the latent violence of categorization itself.",
            "Through careful orchestration of chromatic dissonance, the work proposes an alternative temporality."
        ],
        critiqueTemplates: [
            "In {artist}'s practice, we encounter a rigorous excavation of the everyday's hidden architectures. {title} exemplifies this commitment to what the artist terms 'strategic misapprehension'—a deliberate refusal of the object's intended utility in favor of its phenomenological residue.\n\nThe work's surface bears the traces of what curator Maris Hendriksen has called 'the impossible document.' Here, representation collapses into its own mise-en-abyme, each layer of meaning simultaneously asserting and undermining the next.\n\nCritically, {title} refuses recuperation into either formalist or conceptual lineages. It exists, uncomfortably, in the gap between these modes.",
            "{artist}'s {title} emerges from a body of work concerned with what the artist describes as 'the aesthetics of institutional failure.' The piece foregrounds materiality not as presence but as a kind of structural absence.\n\nExecuted in {medium}, the work demonstrates the artist's commitment to processes that resist mastery. The result is a surface that refuses stability, that seems to shift under sustained observation.\n\nYet this apparent coldness masks a deeper engagement with vulnerability. As {artist} has stated, the work's detachment is itself a performance.",
            "To encounter {title} is to confront the limits of perceptual coherence. {artist} has constructed what appears, at first glance, to be a straightforward study in {medium}—but sustained attention reveals the work's essential paradox.\n\nThe artist works within a tradition that refuses tradition, creating what art historian Felix Rasmussen identifies as 'anti-monuments to the contemporary.'\n\n{title} ultimately refuses the viewer's desire for resolution. It proposes instead a model of meaning as perpetually deferred, always arriving and never quite present."
        ],
        exhibitionTemplates: [
            ["'The Unresolved,' The Corridor, Oslo (2019)", "'Documents of Doubt,' Berlin (2020)", "'After Images,' Copenhagen (2022)"],
            ["'Between States,' Stockholm (2018)", "'Provisional Structures,' Amsterdam (2020)", "'The Empty Archive,' Brussels (2021)"],
            ["'Constructed Absences,' Helsinki (2019)", "'Failed Monuments,' Vienna (2021)", "'The Illegible Object,' Zürich (2022)"]
        ],
        provenanceTemplates: [
            ["Private collection, Oslo", "Estate of Marius Hendriksen", "Sold at auction, Christie's London"],
            ["Commissioned by National Museum", "Collection of Dr. Sofia Bergström", "Temporarily acquired by Van Abbemuseum"],
            ["Originally part of a series", "Acquired by Institute for Indeterminate Studies", "De-accessioned and sold"]
        ]
    };

    useEffect(() => {
        loadArchive();
    }, []);

    useEffect(() => {
        if (currentView === 'archive') {
            loadArchive();
        }
    }, [currentView]);

    useEffect(() => {
        return () => {
            if (autoBidInterval) clearInterval(autoBidInterval);
        };
    }, [autoBidInterval]);

    const loadArchive = async () => {
        try {
            const response = await fetch(`${API_URL}/archive`);
            const data = await response.json();
            setArchive(data);
            
            setGalleryWalls(prev => {
                const purchasedItems = {};
                prev.forEach((wall, index) => {
                    if (wall && wall.type === 'purchased') {
                        purchasedItems[index] = wall;
                    }
                });
                
                const newWalls = data.map(entry => ({
                    id: entry.id,
                    type: 'archive',
                    content: entry
                }));
                
                const totalSlots = 11; // Increased for extra wall space
                for (let i = newWalls.length; i < totalSlots; i++) {
                    if (purchasedItems[i]) {
                        newWalls[i] = purchasedItems[i];
                    } else {
                        newWalls[i] = null;
                    }
                }
                
                return newWalls;
            });
        } catch (error) {
            console.error('Error loading archive:', error);
        }
    };

    const openArtMarket = (slotIndex) => {
        setSelectedWallSlot(slotIndex);
        setShowArtMarket(true);
    };

    const calculateArtworkValue = (artPiece) => {
        const prestigeMap = {
            "Generic Landscapes Inc.": 1.2, "AI Art Studio": 0.8, "Classical Reproductions": 1.5,
            "Stock Photo Gallery": 0.9, "Digital Art Collective": 1.8, "Modern Design Co.": 1.1,
            "Nature Prints Ltd.": 1.3, "Concept Art Group": 1.6
        };
        
        const prestigeMultiplier = prestigeMap[artPiece.artist] || 1.0;
        const marketFluctuation = 0.9 + (Math.random() * 0.3);
        const resaleValue = Math.floor(artPiece.price * prestigeMultiplier * marketFluctuation);
        
        let prestige = prestigeMultiplier >= 1.6 ? "highly regarded" : prestigeMultiplier >= 1.1 ? "mid-career" : "emerging";
        let exhibitions = prestigeMultiplier >= 1.6 ? "major international institutions" : "local and regional venues";
        
        return {
            value: resaleValue,
            prestige: prestige,
            exhibitions: exhibitions,
            profit: resaleValue - artPiece.price
        };
    };

    const openPurchasedArtActions = (wall, slotIndex) => {
        const valuation = calculateArtworkValue(wall.content);
        setSelectedPurchasedArt({
            wall: wall,
            slotIndex: slotIndex,
            valuation: valuation
        });
        setShowArtworkActions(true);
    };

    const sellPurchasedArt = () => {
        if (!selectedPurchasedArt) return;
        setGalleryFunds(prev => prev + selectedPurchasedArt.valuation.value);
        setGalleryWalls(prev => {
            const updated = [...prev];
            updated[selectedPurchasedArt.slotIndex] = null;
            return updated;
        });
        setShowArtworkActions(false);
        setSelectedPurchasedArt(null);
    };

    const swapPurchasedArt = () => {
        if (!selectedPurchasedArt) return;
        setShowArtworkActions(false);
        setSelectedPurchasedArt(null);
        setSelectedWallSlot(selectedPurchasedArt.slotIndex);
        setShowArtMarket(true);
    };

    const purchaseFakeArt = (artPiece) => {
        if (galleryFunds < artPiece.price) {
            alert('Insufficient funds');
            return;
        }
        setGalleryFunds(prev => prev - artPiece.price);
        const newWall = {
            id: Date.now().toString(),
            type: 'purchased',
            content: artPiece
        };
        setGalleryWalls(prev => {
            const updated = [...prev];
            updated[selectedWallSlot] = newWall;
            return updated;
        });
        setShowArtMarket(false);
        setSelectedWallSlot(null);
    };

    const generateRandomCritique = async (imageData) => {
        const year = 1960 + Math.floor(Math.random() * 64);
        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image",
                                    source: { type: "base64", media_type: "image/jpeg", data: imageData.split(',')[1] }
                                },
                                {
                                    type: "text",
                                    text: `You are an absurdist art critic. Analyze this mundane image and generate pretentious art world descriptions.
Return ONLY valid JSON:
{
  "title": "pretentious title",
  "artist": "made-up European name",
  "medium": "pretentious medium",
  "label": "absurdist institutional critique",
  "critique_hook": "dense academic visual description"
}`
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            const analysisText = data.content[0].text;
            const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const analysis = JSON.parse(cleanedText);

            const critiqueTemplate = critiqueTemplates.critiqueTemplates[Math.floor(Math.random() * critiqueTemplates.critiqueTemplates.length)];
            const critique = critiqueTemplate
                .replace(/{artist}/g, analysis.artist)
                .replace(/{title}/g, analysis.title)
                .replace(/{medium}/g, analysis.medium);
            
            const critiqueWithHook = analysis.critique_hook + "\n\n" + critique;
            const exhibitions = critiqueTemplates.exhibitionTemplates[Math.floor(Math.random() * critiqueTemplates.exhibitionTemplates.length)];
            const provenance = critiqueTemplates.provenanceTemplates[Math.floor(Math.random() * critiqueTemplates.provenanceTemplates.length)];
            
            return {
                title: analysis.title,
                artist: analysis.artist,
                year: year.toString(),
                medium: analysis.medium,
                label: analysis.label,
                critique: critiqueWithHook,
                exhibitions,
                provenance,
            };
        } catch (error) {
            console.error('Error analyzing image:', error);
            return generateFallbackCritique(year);
        }
    };

    const generateFallbackCritique = (year) => {
        const title = critiqueTemplates.titleTemplates[Math.floor(Math.random() * critiqueTemplates.titleTemplates.length)];
        const artist = critiqueTemplates.artistTemplates[Math.floor(Math.random() * critiqueTemplates.artistTemplates.length)];
        const medium = critiqueTemplates.mediumTemplates[Math.floor(Math.random() * critiqueTemplates.mediumTemplates.length)];
        const label = critiqueTemplates.labelTemplates[Math.floor(Math.random() * critiqueTemplates.labelTemplates.length)];
        
        let critique = critiqueTemplates.critiqueTemplates[Math.floor(Math.random() * critiqueTemplates.critiqueTemplates.length)];
        critique = critique.replace(/{artist}/g, artist).replace(/{title}/g, title).replace(/{medium}/g, medium);
        
        const exhibitions = critiqueTemplates.exhibitionTemplates[Math.floor(Math.random() * critiqueTemplates.exhibitionTemplates.length)];
        const provenance = critiqueTemplates.provenanceTemplates[Math.floor(Math.random() * critiqueTemplates.provenanceTemplates.length)];
        
        return { title, artist, year: year.toString(), medium, label, critique, exhibitions, provenance };
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1920;
                    const MAX_HEIGHT = 1920;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => { resolve(blob); }, 'image/jpeg', 0.85);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = async (e) => {
            setImagePreview(e.target.result);
            setLoading(true);
            setImage(compressedFile);
            const critiqueData = await generateRandomCritique(e.target.result);
            setCritique(critiqueData);
            setLoading(false);
            setCurrentView('critique');
        };
        reader.readAsDataURL(compressedFile);
    };

    const saveToArchive = async () => {
        if (!imagePreview || !critique) return;
        setSaving(true);
        try {
            const response = await fetch(`${API_URL}/archive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imagePreview, critique: critique })
            });
            const data = await response.json();
            if (data.success) {
                await loadArchive();
                setCurrentView('archive');
                setGalleryView(true);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    // Navigation handlers
    const handleFileSelect = (e) => handleImageUpload(e.target.files[0]);
    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };
    const resetAnalysis = () => {
        setImage(null);
        setImagePreview(null);
        setCritique(null);
        setLoading(false);
        setCurrentView('upload');
    };
    const viewArchive = () => {
        setCurrentView('archive');
        setAuctionSetup(false);
        setGalleryView(true);
        loadArchive();
    };
    const viewEntry = (entry) => {
        setSelectedEntry(entry);
        setCurrentView('entry');
    };

    // Auction handlers
    const toggleSelectForAuction = (entryId) => {
        setSelectedForAuction(prev => prev.includes(entryId) ? prev.filter(id => id !== entryId) : [...prev, entryId]);
    };
    const proceedToAuctionSetup = () => {
        if (selectedForAuction.length === 0) { alert('Please select at least one work'); return; }
        setAuctionSetup(true);
        const prices = {};
        selectedForAuction.forEach(id => { prices[id] = 1000; });
        setStartingPrices(prices);
    };
    const updateStartingPrice = (id, price) => {
        setStartingPrices(prev => ({ ...prev, [id]: parseInt(price) || 0 }));
    };
    const startAuction = () => {
        const selectedWorks = archive.filter(entry => selectedForAuction.includes(entry.id));
        setAuctionIndex(0);
        setCurrentAuctionWork(selectedWorks[0]);
        setCurrentBid(startingPrices[selectedWorks[0].id]);
        setBidHistory([]);
        setAuctionResults([]);
        setAuctionLive(true);
        setAuctionSetup(false);
        startAutoBidding(startingPrices[selectedWorks[0].id]);
    };
    const startAutoBidding = (startPrice) => {
        if (autoBidInterval) clearInterval(autoBidInterval);
        const interval = setInterval(() => {
            const bidIncrement = Math.floor(Math.random() * 500) + 100;
            const bidderName = bidderNames[Math.floor(Math.random() * bidderNames.length)];
            setBidHistory(prev => {
                const lastBid = prev.length > 0 ? prev[0].amount : startPrice;
                const newBid = {
                    amount: lastBid + bidIncrement,
                    bidder: bidderName,
                    time: new Date().toLocaleTimeString(),
                    timestamp: Date.now()
                };
                setCurrentBid(newBid.amount);
                return [newBid, ...prev];
            });
        }, Math.random() * 2000 + 2000);
        setAutoBidInterval(interval);
    };
    const stopAutoBidding = () => {
        if (autoBidInterval) { clearInterval(autoBidInterval); setAutoBidInterval(null); }
    };
    const endCurrentAuction = () => {
        stopAutoBidding();
        const result = { work: currentAuctionWork, finalBid: currentBid, totalBids: bidHistory.length };
        const newResults = [...auctionResults, result];
        setAuctionResults(newResults);
        const selectedWorks = archive.filter(entry => selectedForAuction.includes(entry.id));
        const nextIndex = auctionIndex + 1;
        if (nextIndex < selectedWorks.length) {
            setAuctionIndex(nextIndex);
            setCurrentAuctionWork(selectedWorks[nextIndex]);
            setCurrentBid(startingPrices[selectedWorks[nextIndex].id]);
            setBidHistory([]);
            setTimeout(() => { startAutoBidding(startingPrices[selectedWorks[nextIndex].id]); }, 1000);
        } else {
            setAuctionLive(false);
            setShowSummary(true);
        }
    };
    const closeSummary = async () => {
        stopAutoBidding();
        try {
            for (const id of selectedForAuction) { await fetch(`${API_URL}/archive/${id}`, { method: 'DELETE' }); }
            await loadArchive();
        } catch (error) { console.error('Error removing sold works:', error); }
        const totalRevenue = auctionResults.reduce((sum, result) => sum + result.finalBid, 0);
        setGalleryFunds(prevFunds => prevFunds + totalRevenue);
        setShowSummary(false);
        setSelectedForAuction([]);
        setAuctionResults([]);
        setBidHistory([]);
        setCurrentView('archive');
        setGalleryView(true);
    };

    return (
        <div>
            <header>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="site-title" onClick={() => setCurrentView('upload')} style={{cursor: 'pointer'}}>The Faux Critic</h1>
                            <p className="site-subtitle">Institutional Analysis Archive</p>
                        </div>
                        {galleryFunds > 0 && (
                            <div style={{ border: '1px solid #e0e0e0', padding: '12px 20px', background: '#f8f8f8' }}>
                                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', color: '#666' }}>Total Revenue</div>
                                <div style={{ fontSize: '18px' }}>${galleryFunds.toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                    <div className="nav-buttons">
                        <button className="nav-button" onClick={() => setCurrentView('upload')} style={{ background: currentView === 'upload' ? '#000' : 'transparent', color: currentView === 'upload' ? '#fff' : '#000' }}>Submit</button>
                        <button className="nav-button" onClick={viewArchive} style={{ background: currentView === 'archive' ? '#000' : 'transparent', color: currentView === 'archive' ? '#fff' : '#000' }}>Archive ({archive.length})</button>
                    </div>
                </div>
            </header>

            <main className="container">
                {currentView === 'upload' && !loading && !critique && (
                    <div className={`upload-section ${dragOver ? 'dragover' : ''}`} onClick={() => document.getElementById('fileInput').click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <div className="upload-icon">+</div>
                        <p className="upload-text">Submit Work</p>
                        <input id="fileInput" type="file" className="file-input" accept="image/*" onChange={handleFileSelect} />
                    </div>
                )}
                {loading && <div className="loading-section"><div className="loading-spinner"></div><p className="loading-text">Analyzing</p></div>}
                {currentView === 'critique' && critique && !loading && <CritiqueView critique={critique} imagePreview={imagePreview} resetAnalysis={resetAnalysis} saveToArchive={saveToArchive} saving={saving} />}
                {currentView === 'archive' && !auctionSetup && !auctionLive && <ArchiveView archive={archive} viewEntry={viewEntry} selectedForAuction={selectedForAuction} toggleSelectForAuction={toggleSelectForAuction} proceedToAuctionSetup={proceedToAuctionSetup} galleryView={galleryView} setGalleryView={setGalleryView} galleryWalls={galleryWalls} openArtMarket={openArtMarket} openPurchasedArtActions={openPurchasedArtActions} />}
                {currentView === 'archive' && auctionSetup && <AuctionSetup selectedWorks={archive.filter(entry => selectedForAuction.includes(entry.id))} startingPrices={startingPrices} updateStartingPrice={updateStartingPrice} startAuction={startAuction} cancel={() => setAuctionSetup(false)} />}
                {auctionLive && <LiveAuction currentWork={currentAuctionWork} currentBid={currentBid} bidHistory={bidHistory} endCurrentAuction={endCurrentAuction} auctionIndex={auctionIndex} totalWorks={selectedForAuction.length} />}
                {showSummary && <AuctionSummary results={auctionResults} closeSummary={closeSummary} />}
                {currentView === 'entry' && selectedEntry && <CritiqueView critique={selectedEntry.critique} imagePreview={selectedEntry.image} resetAnalysis={() => setCurrentView('archive')} isArchiveView={true} />}
                {showArtMarket && <ArtMarketModal fakeArtPieces={fakeArtPieces} galleryFunds={galleryFunds} purchaseFakeArt={purchaseFakeArt} onClose={() => setShowArtMarket(false)} />}
                {showArtworkActions && selectedPurchasedArt && <PurchasedArtActions artwork={selectedPurchasedArt} onSell={sellPurchasedArt} onSwap={swapPurchasedArt} onClose={() => { setShowArtworkActions(false); setSelectedPurchasedArt(null); }} />}
            </main>
        </div>
    );
}

// Components
function CritiqueView({ critique, imagePreview, resetAnalysis, saveToArchive, saving, isArchiveView }) {
    return (
        <div className="critique-section">
            <div className="artwork-container">
                <div className="artwork-image-wrapper"><img src={imagePreview} alt={critique.title} className="artwork-image" /></div>
                <div className="artwork-metadata">
                    <h2 className="artwork-title">{critique.title}</h2>
                    <p className="artist-name">{critique.artist}</p>
                    <div className="artwork-details">{critique.year}<br />{critique.medium}</div>
                    <div className="label-section"><h3 className="label-title">Label</h3><p className="label-text">{critique.label}</p></div>
                </div>
            </div>
            <div className="critique-content">
                <h3 className="section-heading">Critical Analysis</h3>
                <div className="critique-text">{critique.critique.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>
                <h3 className="section-heading">Exhibition History</h3>
                <ul className="exhibition-list">{critique.exhibitions.map((e, i) => <li key={i} className="exhibition-item">{e}</li>)}</ul>
                <h3 className="section-heading">Provenance</h3>
                {critique.provenance.map((l, i) => <p key={i} className="provenance-chain">{l}</p>)}
                <div className="qr-section"><div className="qr-code">QR</div><p className="qr-caption">Documentation</p></div>
            </div>
            <div className="new-analysis-section">
                {!isArchiveView && saveToArchive && <button className="new-analysis-button" onClick={saveToArchive} disabled={saving}>{saving ? 'Saving...' : 'Add to Archive'}</button>}
                <button className="new-analysis-button" onClick={resetAnalysis}>{isArchiveView ? 'Back' : 'New Submission'}</button>
            </div>
        </div>
    );
}

function ArchiveView({ archive, viewEntry, selectedForAuction, toggleSelectForAuction, proceedToAuctionSetup, galleryView, setGalleryView, galleryWalls, openArtMarket, openPurchasedArtActions }) {
    return (
        <div style={{ padding: '60px 0' }}>
            <div className="archive-header">
                <h2 className="archive-title">Archive — {archive.length} Works</h2>
                <div className="archive-controls">
                    {archive.length > 0 && (
                        <>
                            <button className="nav-button" onClick={() => setGalleryView(!galleryView)}>{galleryView ? 'Grid View' : 'Gallery View'}</button>
                            {selectedForAuction.length > 0 && <button className="nav-button" onClick={proceedToAuctionSetup} style={{ background: '#000', color: '#fff' }}>List {selectedForAuction.length} Work{selectedForAuction.length !== 1 ? 's' : ''}</button>}
                        </>
                    )}
                </div>
            </div>
            {archive.length === 0 ? <p style={{ textAlign: 'center', padding: '80px 0', color: '#666', fontSize: '13px' }}>No works in archive</p> : galleryView ? <GalleryWallView walls={galleryWalls} openArtMarket={openArtMarket} viewEntry={viewEntry} selectedForAuction={selectedForAuction} toggleSelectForAuction={toggleSelectForAuction} openPurchasedArtActions={openPurchasedArtActions} /> : (
                <div className="archive-grid">
                    {archive.map((entry) => (
                        <div key={entry.id} className="archive-item">
                            <input type="checkbox" className="archive-item-checkbox" checked={selectedForAuction.includes(entry.id)} onChange={() => toggleSelectForAuction(entry.id)} onClick={(e) => e.stopPropagation()} />
                            <img src={entry.image} alt={entry.critique.title} onClick={() => viewEntry(entry)} />
                            <div className="archive-item-info"><h3 className="archive-item-title">{entry.critique.title}</h3><p className="archive-item-artist">{entry.critique.artist}</p><p className="archive-item-year">{entry.critique.year}</p></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function GalleryWallView({ walls, openArtMarket, viewEntry, selectedForAuction, toggleSelectForAuction, openPurchasedArtActions }) {
    const [currentRoom, setCurrentRoom] = useState(0);

    // 3D ROOM CONFIGURATION - UPDATED WITH USER COORDINATES
    const roomConfig = [
        {
            id: 'room1',
            image: 'gallery1.jpg',
            name: "Main Hall",
            slots: [
                { 
                    // Left Wall - Raised (28%)
                    index: 0, 
                    style: { top: '28%', left: '7%', width: '14%', height: '30%', transform: 'perspective(1000px) rotateY(55deg)' } 
                }, 
                { 
                    // Center Wall - Raised (22%)
                    index: 1, 
                    style: { top: '22%', left: '38%', width: '24%', height: '36%' } 
                }, 
                { 
                    // Right Wall - Raised (28%)
                    index: 2, 
                    style: { top: '28%', left: '78%', width: '14%', height: '30%', transform: 'perspective(1000px) rotateY(-55deg)' } 
                }, 
            ]
        },
        {
            id: 'room2',
            image: 'gallery2.jpg',
            name: "East Wing",
            slots: [
                { 
                    // Left Wall - User adjusted
                    index: 3, 
                    style: { top: '30%', left: '8%', width: '10%', height: '25%', transform: 'perspective(1000px) rotateY(40deg)' } 
                }, 
                { 
                    // Center Wall - User adjusted
                    index: 4, 
                    style: { top: '30%', left: '49%', width: '17%', height: '30%' } 
                }, 
                { 
                    // Right Wall - User adjusted
                    index: 5, 
                    style: { top: '27%', left: '81%', width: '15%', height: '50%', transform: 'perspective(600px) rotateY(-60deg)' } 
                }, 
                { 
                    // Small Distant Wall - Kept same
                    index: 6, 
                    style: { top: '40%', left: '36%', width: '8%', height: '18%' } 
                }, 
            ]
        },
        {
            id: 'room3',
            image: 'gallery3.jpg',
            name: "West Wing",
            slots: [
                { 
                    // Left Wall
                    index: 7, 
                    style: { top: '25%', left: '5%', width: '18%', height: '40%', transform: 'perspective(1000px) rotateY(45deg)' } 
                }, 
                { 
                    // Back Wall Left - Larger
                    index: 8, 
                    style: { top: '38%', left: '35%', width: '10%', height: '20%' } 
                }, 
                { 
                    // Back Wall Right - Larger
                    index: 10, 
                    style: { top: '27%', left: '52%', width: '15%', height: '36%' } 
                }, 
                { 
                    // Right Wall - More right (75%), smaller (20%w, 40%h)
                    index: 9, 
                    style: { top: '25%', left: '75%', width: '20%', height: '40%', transform: 'perspective(1000px) rotateY(-60deg)' } 
                }
            ]
        }
    ];

    const handleRoomChange = (direction) => {
        if (direction === 'next') { setCurrentRoom((prev) => (prev + 1) % roomConfig.length); } 
        else { setCurrentRoom((prev) => (prev - 1 + roomConfig.length) % roomConfig.length); }
    };

    const renderArtwork = (wall, slotIndex) => {
        if (!wall) {
            return (
                <div className="gallery-wall-empty" onClick={(e) => { e.stopPropagation(); openArtMarket(slotIndex); }}>
                    <span className="plus-icon">+</span>
                </div>
            );
        }
        const isArchive = wall.type === 'archive';
        const isPurchased = wall.type === 'purchased';
        const imageUrl = isArchive ? wall.content.image : wall.content.image;
        const title = isArchive ? wall.content.critique.title : wall.content.title;
        const isSelected = isArchive && selectedForAuction && selectedForAuction.includes(wall.id);

        return (
            <div className={`gallery-wall-content ${isSelected ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); if (isArchive) viewEntry(wall.content); else if (isPurchased) openPurchasedArtActions(wall, slotIndex); }}>
                {isArchive && <div className={`gallery-checkbox ${isSelected ? 'checked' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSelectForAuction(wall.id); }}>{isSelected && '✓'}</div>}
                <img src={imageUrl} alt={title} />
                <div className="gallery-wall-label">{title}</div>
            </div>
        );
    };

    const currentRoomConfig = roomConfig[currentRoom];

    return (
        <div className="immersive-gallery-container">
            <div className="gallery-nav-overlay">
                <button className="gallery-nav-btn prev" onClick={() => handleRoomChange('prev')}>←</button>
                <div className="room-indicator">
                    {currentRoomConfig.name}
                    <div className="dots">{roomConfig.map((_, idx) => <span key={idx} className={idx === currentRoom ? 'active' : ''}>•</span>)}</div>
                </div>
                <button className="gallery-nav-btn next" onClick={() => handleRoomChange('next')}>→</button>
            </div>
            <div className="gallery-room-view">
                <img src={currentRoomConfig.image} alt={currentRoomConfig.name} className="room-background" />
                {currentRoomConfig.slots.map((slot) => (
                    <div key={slot.index} className="gallery-slot-container" style={slot.style}>{renderArtwork(walls[slot.index], slot.index)}</div>
                ))}
            </div>
        </div>
    );
}

function AuctionSetup({ selectedWorks, startingPrices, updateStartingPrice, startAuction, cancel }) {
    return (
        <div className="auction-setup">
            <h2 className="auction-title">Configure Auction</h2>
            <div className="selected-works">
                {selectedWorks.map((work) => (
                    <div key={work.id} className="selected-work-item">
                        <img src={work.image} alt={work.critique.title} />
                        <div className="selected-work-info">
                            <p style={{ fontSize: '14px', marginBottom: '5px' }}>{work.critique.title}</p>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>{work.critique.artist}</p>
                            <div className="starting-price-input"><label>Starting Price</label><input type="number" value={startingPrices[work.id]} onChange={(e) => updateStartingPrice(work.id, e.target.value)} placeholder="Enter amount" /></div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '15px' }}><button className="start-auction-button" onClick={startAuction}>Begin Auction</button><button className="nav-button" onClick={cancel} style={{ padding: '15px 40px' }}>Cancel</button></div>
        </div>
    );
}

function LiveAuction({ currentWork, currentBid, bidHistory, endCurrentAuction, auctionIndex, totalWorks }) {
    return (
        <div className="auction-live">
            <div style={{ marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}><p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Lot {auctionIndex + 1} of {totalWorks}</p></div>
            <div className="auction-live-grid">
                <div className="auction-artwork-display">
                    <img src={currentWork.image} alt={currentWork.critique.title} />
                    <h3 style={{ fontSize: '20px', fontWeight: '400', marginBottom: '8px' }}>{currentWork.critique.title}</h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>{currentWork.critique.artist}, {currentWork.critique.year}</p>
                    <div className="current-bid">${currentBid.toLocaleString()}</div>
                    <div style={{ marginTop: '40px' }}>
                        <button className="end-auction-button" onClick={endCurrentAuction}>{auctionIndex + 1 < totalWorks ? 'Sold - Next Lot' : 'Sold - End Auction'}</button>
                        <p style={{ fontSize: '11px', color: '#666', marginTop: '15px', textAlign: 'center' }}>Click when bidding slows</p>
                    </div>
                </div>
                <div className="bid-history">
                    <h4 className="bid-history-title">Live Bidding</h4>
                    {bidHistory.length === 0 ? <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '20px' }}>Waiting for first bid...</p> : bidHistory.map((bid, index) => (
                        <div key={index} className="bid-item" style={{ animation: index === 0 ? 'bidEnter 0.3s ease-out' : 'none' }}>
                            <p className="bid-amount">${bid.amount.toLocaleString()}</p>
                            <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{bid.bidder}</p>
                            <p className="bid-time">{bid.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AuctionSummary({ results, closeSummary }) {
    const totalRevenue = results.reduce((sum, result) => sum + result.finalBid, 0);
    return (
        <div className="auction-summary-overlay">
            <div className="auction-summary-content">
                <h2 className="auction-summary-title">Auction Complete</h2>
                <div className="auction-summary-details">
                    {results.map((result, index) => (
                        <div key={index} className="summary-row">
                            <div><p style={{ fontSize: '13px' }}>{result.work.critique.title}</p><p className="summary-label">{result.totalBids} bids</p></div>
                            <div className="summary-value">${result.finalBid.toLocaleString()}</div>
                        </div>
                    ))}
                    <div className="final-price">Total: ${totalRevenue.toLocaleString()}</div>
                </div>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '30px', lineHeight: '1.8' }}>Works have been removed from archive. All institutional value has been successfully liquidated.</p>
                <button className="start-auction-button" onClick={closeSummary}>Return to Archive</button>
            </div>
        </div>
    );
}

function ArtMarketModal({ fakeArtPieces, galleryFunds, purchaseFakeArt, onClose }) {
    return (
        <div className="art-market-overlay" onClick={onClose}>
            <div className="art-market-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
                    <h2 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>Art Market</h2>
                    <div><p style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>Available Funds</p><p style={{ fontSize: '18px' }}>${galleryFunds.toLocaleString()}</p></div>
                </div>
                <div className="art-market-grid">
                    {fakeArtPieces.map((piece, index) => (
                        <div key={index} className="art-market-item">
                            <div className="art-market-image"><img src={piece.image} alt={piece.title} /></div>
                            <div className="art-market-info">
                                <h3 style={{ fontSize: '13px', marginBottom: '4px' }}>{piece.title}</h3>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>{piece.artist}</p>
                                <p style={{ fontSize: '16px', marginBottom: '12px' }}>${piece.price.toLocaleString()}</p>
                                <button className="purchase-button" onClick={() => purchaseFakeArt(piece)} disabled={galleryFunds < piece.price}>{galleryFunds < piece.price ? 'Insufficient Funds' : 'Purchase'}</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="nav-button" onClick={onClose} style={{ marginTop: '30px' }}>Close</button>
            </div>
        </div>
    );
}

function PurchasedArtActions({ artwork, onSell, onSwap, onClose }) {
    const { wall, valuation } = artwork;
    const isProfitable = valuation.profit > 0;
    return (
        <div className="art-market-overlay" onClick={onClose}>
            <div className="purchased-art-actions" onClick={(e) => e.stopPropagation()}>
                <div className="purchased-art-preview"><img src={wall.content.image} alt={wall.content.title} /></div>
                <div className="purchased-art-details">
                    <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{wall.content.title}</h2>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>{wall.content.artist}</p>
                    <div style={{ padding: '20px', background: '#f8f8f8', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666', marginBottom: '15px' }}>Market Valuation</h3>
                        <div style={{ marginBottom: '12px' }}><span style={{ fontSize: '12px', color: '#666' }}>Artist Status:</span><span style={{ fontSize: '13px', marginLeft: '10px', textTransform: 'capitalize' }}>{valuation.prestige}</span></div>
                        <div style={{ marginBottom: '12px' }}><span style={{ fontSize: '12px', color: '#666' }}>Exhibition History:</span><p style={{ fontSize: '12px', marginTop: '5px' }}>Displayed at {valuation.exhibitions}</p></div>
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                            <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '12px', color: '#666' }}>Original Purchase:</span><span style={{ fontSize: '14px', marginLeft: '10px' }}>${wall.content.price.toLocaleString()}</span></div>
                            <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '12px', color: '#666' }}>Current Value:</span><span style={{ fontSize: '18px', marginLeft: '10px' }}>${valuation.value.toLocaleString()}</span></div>
                            <div><span style={{ fontSize: '12px', color: '#666' }}>{isProfitable ? 'Profit:' : 'Loss:'}</span><span style={{ fontSize: '16px', marginLeft: '10px', color: isProfitable ? '#22c55e' : '#ef4444', fontWeight: '500' }}>{isProfitable ? '+' : ''}${valuation.profit.toLocaleString()}</span></div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <button className="start-auction-button" onClick={onSell} style={{ flex: 1 }}>Sell for ${valuation.value.toLocaleString()}</button>
                        <button className="nav-button" onClick={onSwap} style={{ flex: 1, padding: '15px' }}>Swap Artwork</button>
                    </div>
                    <button className="nav-button" onClick={onClose} style={{ width: '100%', padding: '12px' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);