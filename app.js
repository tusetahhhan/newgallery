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
    
    // Auction states - NEW USER-MEDIATED SYSTEM
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
    const [galleryView, setGalleryView] = useState(true); // Default to gallery view
    const [galleryWalls, setGalleryWalls] = useState(() => {
        const saved = localStorage.getItem('galleryWalls');
        return saved ? JSON.parse(saved) : [];
    });
    const [showArtMarket, setShowArtMarket] = useState(false);
    const [selectedWallSlot, setSelectedWallSlot] = useState(null);
    const [showArtworkActions, setShowArtworkActions] = useState(false);
    const [selectedPurchasedArt, setSelectedPurchasedArt] = useState(null);
    
    // Fake art pieces you can buy
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
    
    // Fake bidder names
    const bidderNames = [
        "Anonymous Collector",
        "Margaux T.",
        "Dr. K. Holmquist",
        "Y. Benveniste Foundation",
        "Private Swiss Buyer",
        "Museum Acquisitions",
        "L. Vermeer Trust",
        "Institutional Buyer",
        "D. Kostas Collection",
        "Anonymous Phone Bidder",
        "Online Bidder 47",
        "Gallery Representative"
    ];
    
    const [galleryFunds, setGalleryFunds] = useState(() => {
        const saved = localStorage.getItem('galleryFunds');
        return saved ? parseInt(saved, 10) : 0;
    });

    // Save gallery funds to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('galleryFunds', galleryFunds.toString());
    }, [galleryFunds]);

    // Save gallery walls to localStorage
    useEffect(() => {
        localStorage.setItem('galleryWalls', JSON.stringify(galleryWalls));
    }, [galleryWalls]);

    const critiqueTemplates = {
        titleTemplates: [
            "Interval Between Surfaces",
            "The Perpetual Threshold",
            "Moment of Recursive Absence",
            "Fragmented Continuity #7",
            "Study in Temporal Displacement",
            "The Weight of Empty Gestures",
            "Archaeology of the Present",
            "Liminal Object (Untitled)",
            "Recursive Negation Series",
            "Document of Impossibility",
        ],
        artistTemplates: [
            "Margaux Thelin",
            "Kasper Holmquist",
            "Yara Benveniste",
            "Sven Kjelland",
            "Lucia Vermeer",
            "Dimitri Kostas",
            "Ingrid Sørensen",
            "Felix Aguirre",
            "Maris Hendriksen",
            "Lars Bergman",
        ],
        mediumTemplates: [
            "Acrylic and coffee grounds on linen",
            "Digital print on salvaged aluminum",
            "Tempera and zinc oxide on reclaimed billboard",
            "Oil and graphite on unstretched canvas",
            "Mixed media with industrial felt and resin",
            "Inkjet on architectural mylar",
            "Encaustic and rust on birch panel",
            "Screenprint on deconstructed textile",
            "Charcoal and interference pigment on paper",
            "Found object with epoxy resin",
        ],
        labelTemplates: [
            "This work interrogates the phenomenology of domestic ephemera through a lens of post-structural ambivalence. The artist's gesture simultaneously affirms and negates the material presence of the quotidian object.",
            "Employing a methodology of deliberate mis-registration, the work exists in productive tension between legibility and opacity. The surface becomes a site of contested meaning-making.",
            "The piece operates within a framework of radical banality, foregrounding the latent violence of categorization itself. What appears as documentation reveals itself as pure construction.",
            "Through careful orchestration of chromatic dissonance, the work proposes an alternative temporality—one that refuses linear narrative in favor of recursive encounter.",
        ],
        critiqueTemplates: [
            "In {artist}'s practice, we encounter a rigorous excavation of the everyday's hidden architectures. {title} exemplifies this commitment to what the artist terms 'strategic misapprehension'—a deliberate refusal of the object's intended utility in favor of its phenomenological residue.\n\nThe work's surface bears the traces of what curator Maris Hendriksen has called 'the impossible document.' Here, representation collapses into its own mise-en-abyme, each layer of meaning simultaneously asserting and undermining the next. The piece was executed using a technique the artist developed during a residency in an abandoned textile factory—a process involving repeated exposure to controlled moisture followed by aggressive desiccation.\n\nWhat emerges is less object than threshold, less image than index of seeing itself. The work participates in what theorist Jakob Vestergaard identifies as 'post-evidentiary practice'—art that operates after the collapse of truth claims, in the space where certainty once resided. The viewer confronts not representation but the ghost of representation, haunted by its own impossibility.\n\nCritically, {title} refuses recuperation into either formalist or conceptual lineages. It exists, uncomfortably, in the gap between these modes—a gap that, as the artist insists, is the only honest space remaining to contemporary practice.",
            
            "{artist}'s {title} emerges from a body of work concerned with what the artist describes as 'the aesthetics of institutional failure.' The piece foregrounds materiality not as presence but as a kind of structural absence—the thing that remains when use-value has been extracted and discarded.\n\nExecuted in {medium}, the work demonstrates the artist's commitment to processes that resist mastery. During its creation, {artist} employed a method borrowed from obsolete industrial protocols, deliberately introducing errors at every stage of production. The result is a surface that refuses stability, that seems to shift under sustained observation.\n\nThe piece gained significant attention following its inclusion in the 2019 survey 'Objects Without Qualities' at the Berlinische Galerie, where critic Petra Svensson noted its 'aggressive refusal of affect.' Indeed, {title} seems to operate in a register beyond emotional response, in what philosopher Anna Kristeva has termed 'the post-affective sublime.'\n\nYet this apparent coldness masks a deeper engagement with vulnerability. As {artist} has stated, the work's detachment is itself a performance—a way of holding space for something that cannot be directly named or shown. The viewer is positioned not as witness but as participant in this failure to cohere.",
            
            "To encounter {title} is to confront the limits of perceptual coherence. {artist} has constructed what appears, at first glance, to be a straightforward study in {medium}—but sustained attention reveals the work's essential paradox. The image, if we can call it that, operates in deliberate tension with its own conditions of possibility.\n\nThe artist works within a tradition that refuses tradition, creating what art historian Felix Rasmussen identifies as 'anti-monuments to the contemporary.' The piece was created using a hybrid methodology that combines digital manipulation with analog degradation—each process meant to undo the certainties established by the other.\n\nWhat results is neither image nor object but what critic Sanne Vestergaard terms a 'document of its own impossibility.' The work has been exhibited widely in contexts that emphasize this categorical ambiguity—most notably in 'The Unfinished Archive,' a 2021 exhibition at WIELS Contemporary Art Centre that examined art's relationship to incompletion.\n\n{title} ultimately refuses the viewer's desire for resolution. It proposes instead a model of meaning as perpetually deferred, always arriving and never quite present. In this way, {artist}'s practice aligns with what theorist Lars Bergman calls 'the aesthetics of the almost'—art that lives in approximation rather than arrival.",
        ],
        exhibitionTemplates: [
            [
                "'The Unresolved,' The Corridor, Oslo (2019)",
                "'Documents of Doubt,' Room for Time, Berlin (2020)",
                "'After Images,' The Third Space, Copenhagen (2022)",
                "'Material Uncertainties,' Gallery Void, London (2023)",
            ],
            [
                "'Between States,' The Margin, Stockholm (2018)",
                "'Provisional Structures,' Institute for Speculation, Amsterdam (2020)",
                "'The Empty Archive,' Cabinet Space, Brussels (2021)",
                "'Strategies of Refusal,' The Non-Site, Paris (2023)",
            ],
            [
                "'Constructed Absences,' The Interval, Helsinki (2019)",
                "'Failed Monuments,' Space of Exception, Vienna (2021)",
                "'The Illegible Object,' Centre for Doubt, Zürich (2022)",
            ],
        ],
        provenanceTemplates: [
            [
                "Private collection, Oslo (acquired directly from artist, 2019)",
                "Estate of Marius Hendriksen, Copenhagen (gift from unknown donor, 2020)",
                "Sold at auction, Christie's London (provenance disputed, 2021)",
                "Current location unknown (last recorded in Berlin, 2023)",
            ],
            [
                "Commissioned by the National Museum of Contemporary Art, purchased by private collector before delivery (2018)",
                "Collection of Dr. Sofia Bergström, Stockholm (inherited from seller's estate despite having no prior connection, 2020)",
                "Temporarily acquired by the Van Abbemuseum, returned under unclear circumstances (2022)",
                "Present whereabouts contested between two claiming owners",
            ],
            [
                "Originally part of a series of twelve, this is reportedly number seven of nine",
                "Acquired by The Institute for Indeterminate Studies, Vienna (2019)",
                "De-accessioned and sold to fund acquisition of works by the same artist already in collection (2021)",
                "Current owner prefers to remain anonymous but is known to the artist",
            ],
        ],
    };

    useEffect(() => {
        loadArchive();
    }, []);

    useEffect(() => {
        if (currentView === 'archive') {
            loadArchive();
        }
    }, [currentView]);

    // Cleanup auto-bidding on unmount
    useEffect(() => {
        return () => {
            if (autoBidInterval) {
                clearInterval(autoBidInterval);
            }
        };
    }, [autoBidInterval]);

    const loadArchive = async () => {
        try {
            const response = await fetch(`${API_URL}/archive`);
            const data = await response.json();
            setArchive(data);
            
            // Sync gallery walls with archive - always show archive items
            setGalleryWalls(prev => {
                // Create a map of existing purchased items by index
                const purchasedItems = {};
                prev.forEach((wall, index) => {
                    if (wall && wall.type === 'purchased') {
                        purchasedItems[index] = wall;
                    }
                });
                
                // Start fresh with archive items
                const newWalls = data.map(entry => ({
                    id: entry.id,
                    type: 'archive',
                    content: entry
                }));
                
                // Add back purchased items in remaining slots
                const totalSlots = 10;
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
        // Generate a resale value based on the artist's prestige
        // More prestigious = higher markup
        const prestigeMap = {
            "Generic Landscapes Inc.": 1.2,
            "AI Art Studio": 0.8,
            "Classical Reproductions": 1.5,
            "Stock Photo Gallery": 0.9,
            "Digital Art Collective": 1.8,
            "Modern Design Co.": 1.1,
            "Nature Prints Ltd.": 1.3,
            "Concept Art Group": 1.6,
        };
        
        const prestigeMultiplier = prestigeMap[artPiece.artist] || 1.0;
        const marketFluctuation = 0.9 + (Math.random() * 0.3); // 0.9 to 1.2
        const resaleValue = Math.floor(artPiece.price * prestigeMultiplier * marketFluctuation);
        
        // Generate prestige description
        let prestige = "emerging";
        let exhibitions = "regional galleries";
        
        if (prestigeMultiplier >= 1.6) {
            prestige = "highly regarded";
            exhibitions = "major international institutions including Tate Modern and MoMA";
        } else if (prestigeMultiplier >= 1.3) {
            prestige = "established";
            exhibitions = "prestigious galleries across Europe";
        } else if (prestigeMultiplier >= 1.1) {
            prestige = "mid-career";
            exhibitions = "notable galleries and art fairs";
        } else {
            prestige = "emerging";
            exhibitions = "local and regional venues";
        }
        
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
        
        // Add resale value to funds
        setGalleryFunds(prev => prev + selectedPurchasedArt.valuation.value);
        
        // Remove from gallery walls
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
        
        // Open art market for the same slot
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

        // Deduct cost
        setGalleryFunds(prev => prev - artPiece.price);

        // Add to gallery wall
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
            // Call Claude API to analyze the image
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image",
                                    source: {
                                        type: "base64",
                                        media_type: "image/jpeg",
                                        data: imageData.split(',')[1]
                                    }
                                },
                                {
                                    type: "text",
                                    text: `You are an absurdist art critic writing institutional critique for "The Faux Critic" archive. Analyze this mundane image and generate pretentious art world descriptions.

Return ONLY valid JSON in this exact format (no markdown, no backticks):
{
  "title": "a pretentious artwork title based on what you see",
  "artist": "a made-up European artist name",
  "medium": "describe the image content as if it were an artwork medium (e.g., 'Digital photograph on archival substrate', 'Inkjet print with found imagery')",
  "label": "one sentence of absurdist institutional critique about this image",
  "critique_hook": "describe what you actually see in the image in 1-2 sentences, written in dense academic language"
}

Make it satirical. The more mundane the image, the more pretentious the description.`
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            const analysisText = data.content[0].text;
            
            // Parse the JSON response
            let analysis;
            try {
                // Remove markdown code blocks if present
                const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                analysis = JSON.parse(cleanedText);
            } catch (e) {
                console.error('Failed to parse AI response:', analysisText);
                // Fallback to random generation
                return generateFallbackCritique(year);
            }

            // Use AI analysis for title, artist, medium, label
            // But keep our template-based system for the long critique
            const critiqueTemplate = critiqueTemplates.critiqueTemplates[Math.floor(Math.random() * critiqueTemplates.critiqueTemplates.length)];
            const critique = critiqueTemplate
                .replace(/{artist}/g, analysis.artist)
                .replace(/{title}/g, analysis.title)
                .replace(/{medium}/g, analysis.medium);
            
            // Insert the image-specific hook at the beginning
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
        // Original random generation as fallback
        const title = critiqueTemplates.titleTemplates[Math.floor(Math.random() * critiqueTemplates.titleTemplates.length)];
        const artist = critiqueTemplates.artistTemplates[Math.floor(Math.random() * critiqueTemplates.artistTemplates.length)];
        const medium = critiqueTemplates.mediumTemplates[Math.floor(Math.random() * critiqueTemplates.mediumTemplates.length)];
        const label = critiqueTemplates.labelTemplates[Math.floor(Math.random() * critiqueTemplates.labelTemplates.length)];
        
        let critique = critiqueTemplates.critiqueTemplates[Math.floor(Math.random() * critiqueTemplates.critiqueTemplates.length)];
        critique = critique.replace(/{artist}/g, artist).replace(/{title}/g, title).replace(/{medium}/g, medium);
        
        const exhibitions = critiqueTemplates.exhibitionTemplates[Math.floor(Math.random() * critiqueTemplates.exhibitionTemplates.length)];
        const provenance = critiqueTemplates.provenanceTemplates[Math.floor(Math.random() * critiqueTemplates.provenanceTemplates.length)];
        
        return {
            title,
            artist,
            year: year.toString(),
            medium,
            label,
            critique,
            exhibitions,
            provenance,
        };
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
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.85);
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

            // Generate critique based on the actual image
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imagePreview,
                    critique: critique
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update archive count immediately
                await loadArchive();
                // Automatically go to archive in gallery view
                setCurrentView('archive');
                setGalleryView(true);
            }
        } catch (error) {
            console.error('Error saving to archive:', error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
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
        setGalleryView(true); // Default to gallery view
        loadArchive();
    };

    const viewEntry = (entry) => {
        setSelectedEntry(entry);
        setCurrentView('entry');
    };

    // NEW AUCTION FUNCTIONS
    const toggleSelectForAuction = (entryId) => {
        setSelectedForAuction(prev => {
            if (prev.includes(entryId)) {
                return prev.filter(id => id !== entryId);
            } else {
                return [...prev, entryId];
            }
        });
    };

    const proceedToAuctionSetup = () => {
        if (selectedForAuction.length === 0) {
            alert('Please select at least one work');
            return;
        }
        setAuctionSetup(true);
        
        // Initialize starting prices
        const prices = {};
        selectedForAuction.forEach(id => {
            prices[id] = 1000;
        });
        setStartingPrices(prices);
    };

    const updateStartingPrice = (id, price) => {
        setStartingPrices(prev => ({
            ...prev,
            [id]: parseInt(price) || 0
        }));
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
        
        // Start automatic bidding
        startAutoBidding(startingPrices[selectedWorks[0].id]);
    };

    const startAutoBidding = (startPrice) => {
        // Clear any existing interval
        if (autoBidInterval) {
            clearInterval(autoBidInterval);
        }
        
        // Create interval for automatic bids every 2-4 seconds
        const interval = setInterval(() => {
            const bidIncrement = Math.floor(Math.random() * 500) + 100; // $100-600 increment
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
        }, Math.random() * 2000 + 2000); // Random interval 2-4 seconds
        
        setAutoBidInterval(interval);
    };

    const stopAutoBidding = () => {
        if (autoBidInterval) {
            clearInterval(autoBidInterval);
            setAutoBidInterval(null);
        }
    };

    const endCurrentAuction = () => {
        stopAutoBidding();
        
        const result = {
            work: currentAuctionWork,
            finalBid: currentBid,
            totalBids: bidHistory.length
        };
        
        const newResults = [...auctionResults, result];
        setAuctionResults(newResults);
        
        const selectedWorks = archive.filter(entry => selectedForAuction.includes(entry.id));
        const nextIndex = auctionIndex + 1;
        
        if (nextIndex < selectedWorks.length) {
            // Move to next work
            setAuctionIndex(nextIndex);
            setCurrentAuctionWork(selectedWorks[nextIndex]);
            setCurrentBid(startingPrices[selectedWorks[nextIndex].id]);
            setBidHistory([]);
            
            // Start bidding for next work
            setTimeout(() => {
                startAutoBidding(startingPrices[selectedWorks[nextIndex].id]);
            }, 1000);
        } else {
            // All works done - show summary and delete from archive
            setAuctionLive(false);
            setShowSummary(true);
        }
    };

    const closeSummary = async () => {
        stopAutoBidding(); // Make sure auto-bidding is stopped
        
        // Remove sold works from archive on server
        try {
            for (const id of selectedForAuction) {
                await fetch(`${API_URL}/archive/${id}`, {
                    method: 'DELETE'
                });
            }
            
            // Reload archive which will auto-update gallery walls
            await loadArchive();
        } catch (error) {
            console.error('Error removing sold works:', error);
        }
        
        // Update gallery funds
        const totalRevenue = auctionResults.reduce((sum, result) => sum + result.finalBid, 0);
        setGalleryFunds(prevFunds => prevFunds + totalRevenue);
        
        setShowSummary(false);
        setSelectedForAuction([]);
        setAuctionResults([]);
        setBidHistory([]);
        setCurrentView('archive');
        setGalleryView(true); // Always go to gallery view after auction
    };

    return (
        <div>
            <header>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 className="site-title" onClick={() => setCurrentView('upload')} style={{cursor: 'pointer'}}>
                                The Faux Critic
                            </h1>
                            <p className="site-subtitle">Institutional Analysis Archive</p>
                        </div>
                        {galleryFunds > 0 && (
                            <div style={{
                                border: '1px solid #e0e0e0',
                                padding: '12px 20px',
                                background: '#f8f8f8'
                            }}>
                                <div style={{
                                    fontSize: '10px',
                                    fontWeight: '400',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '6px',
                                    color: '#666'
                                }}>
                                    Total Revenue
                                </div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '400'
                                }}>
                                    ${galleryFunds.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="nav-buttons">
                        <button 
                            className="nav-button"
                            onClick={() => setCurrentView('upload')}
                            style={{
                                background: currentView === 'upload' ? '#000' : 'transparent',
                                color: currentView === 'upload' ? '#fff' : '#000',
                            }}
                        >
                            Submit
                        </button>
                        <button 
                            className="nav-button"
                            onClick={viewArchive}
                            style={{
                                background: currentView === 'archive' ? '#000' : 'transparent',
                                color: currentView === 'archive' ? '#fff' : '#000',
                            }}
                        >
                            Archive ({archive.length})
                        </button>
                    </div>
                </div>
            </header>

            <main className="container">
                {currentView === 'upload' && !loading && !critique && (
                    <div
                        className={`upload-section ${dragOver ? 'dragover' : ''}`}
                        onClick={() => document.getElementById('fileInput').click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="upload-icon">+</div>
                        <p className="upload-text">Submit Work</p>
                        <p className="upload-subtext">Click or drag image</p>
                        <input
                            id="fileInput"
                            type="file"
                            className="file-input"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>
                )}

                {loading && (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Analyzing</p>
                    </div>
                )}

                {currentView === 'critique' && critique && !loading && (
                    <CritiqueView 
                        critique={critique}
                        imagePreview={imagePreview}
                        resetAnalysis={resetAnalysis}
                        saveToArchive={saveToArchive}
                        saving={saving}
                    />
                )}

                {currentView === 'archive' && !auctionSetup && !auctionLive && (
                    <ArchiveView 
                        archive={archive}
                        viewEntry={viewEntry}
                        selectedForAuction={selectedForAuction}
                        toggleSelectForAuction={toggleSelectForAuction}
                        proceedToAuctionSetup={proceedToAuctionSetup}
                        galleryView={galleryView}
                        setGalleryView={setGalleryView}
                        galleryWalls={galleryWalls}
                        openArtMarket={openArtMarket}
                        openPurchasedArtActions={openPurchasedArtActions}
                    />
                )}

                {currentView === 'archive' && auctionSetup && (
                    <AuctionSetup
                        selectedWorks={archive.filter(entry => selectedForAuction.includes(entry.id))}
                        startingPrices={startingPrices}
                        updateStartingPrice={updateStartingPrice}
                        startAuction={startAuction}
                        cancel={() => setAuctionSetup(false)}
                    />
                )}

                {auctionLive && (
                    <LiveAuction
                        currentWork={currentAuctionWork}
                        currentBid={currentBid}
                        bidHistory={bidHistory}
                        endCurrentAuction={endCurrentAuction}
                        auctionIndex={auctionIndex}
                        totalWorks={selectedForAuction.length}
                    />
                )}

                {showSummary && (
                    <AuctionSummary
                        results={auctionResults}
                        closeSummary={closeSummary}
                    />
                )}

                {currentView === 'entry' && selectedEntry && (
                    <CritiqueView 
                        critique={selectedEntry.critique}
                        imagePreview={selectedEntry.image}
                        resetAnalysis={() => setCurrentView('archive')}
                        isArchiveView={true}
                    />
                )}

                {showArtMarket && (
                    <ArtMarketModal
                        fakeArtPieces={fakeArtPieces}
                        galleryFunds={galleryFunds}
                        purchaseFakeArt={purchaseFakeArt}
                        onClose={() => setShowArtMarket(false)}
                    />
                )}

                {showArtworkActions && selectedPurchasedArt && (
                    <PurchasedArtActions
                        artwork={selectedPurchasedArt}
                        onSell={sellPurchasedArt}
                        onSwap={swapPurchasedArt}
                        onClose={() => {
                            setShowArtworkActions(false);
                            setSelectedPurchasedArt(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
}

function CritiqueView({ critique, imagePreview, resetAnalysis, saveToArchive, saving, isArchiveView }) {
    return (
        <div className="critique-section">
            <div className="artwork-container">
                <div className="artwork-image-wrapper">
                    <img
                        src={imagePreview}
                        alt={critique.title}
                        className="artwork-image"
                    />
                </div>
                
                <div className="artwork-metadata">
                    <h2 className="artwork-title">{critique.title}</h2>
                    <p className="artist-name">{critique.artist}</p>
                    <div className="artwork-details">
                        {critique.year}<br />
                        {critique.medium}
                    </div>
                    
                    <div className="label-section">
                        <h3 className="label-title">Label</h3>
                        <p className="label-text">{critique.label}</p>
                    </div>
                </div>
            </div>

            <div className="critique-content">
                <h3 className="section-heading">Critical Analysis</h3>
                <div className="critique-text">
                    {critique.critique.split('\n\n').map((paragraph, index) => (
                        <p key={index}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                <h3 className="section-heading">Exhibition History</h3>
                <ul className="exhibition-list">
                    {critique.exhibitions.map((exhibition, index) => (
                        <li key={index} className="exhibition-item">
                            {exhibition}
                        </li>
                    ))}
                </ul>

                <h3 className="section-heading">Provenance</h3>
                {critique.provenance.map((line, index) => (
                    <p key={index} className="provenance-chain">
                        {line}
                    </p>
                ))}

                <div className="qr-section">
                    <div className="qr-code">
                        QR
                    </div>
                    <p className="qr-caption">Documentation</p>
                </div>
            </div>

            <div className="new-analysis-section">
                {!isArchiveView && saveToArchive && (
                    <button
                        className="new-analysis-button"
                        onClick={saveToArchive}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Add to Archive'}
                    </button>
                )}
                <button
                    className="new-analysis-button"
                    onClick={resetAnalysis}
                >
                    {isArchiveView ? 'Back' : 'New Submission'}
                </button>
            </div>
        </div>
    );
}

function ArchiveView({ archive, viewEntry, selectedForAuction, toggleSelectForAuction, proceedToAuctionSetup, galleryView, setGalleryView, galleryWalls, openArtMarket, openPurchasedArtActions }) {
    return (
        <div style={{ padding: '60px 0' }}>
            <div className="archive-header">
                <h2 className="archive-title">
                    Archive — {archive.length} Works
                </h2>
                
                <div className="archive-controls">
                    {archive.length > 0 && (
                        <>
                            <button
                                className="nav-button"
                                onClick={() => setGalleryView(!galleryView)}
                            >
                                {galleryView ? 'Grid View' : 'Gallery View'}
                            </button>
                            {selectedForAuction.length > 0 && (
                                <button
                                    className="nav-button"
                                    onClick={proceedToAuctionSetup}
                                    style={{ background: '#000', color: '#fff' }}
                                >
                                    List {selectedForAuction.length} Work{selectedForAuction.length !== 1 ? 's' : ''}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {archive.length === 0 ? (
                <p style={{ 
                    textAlign: 'center',
                    padding: '80px 0',
                    color: '#666',
                    fontSize: '13px'
                }}>
                    No works in archive
                </p>
            ) : galleryView ? (
                <GalleryWallView 
                    walls={galleryWalls} 
                    openArtMarket={openArtMarket}
                    viewEntry={viewEntry}
                    selectedForAuction={selectedForAuction}
                    toggleSelectForAuction={toggleSelectForAuction}
                    openPurchasedArtActions={openPurchasedArtActions}
                />
            ) : (
                <div className="archive-grid">
                    {archive.map((entry) => (
                        <div 
                            key={entry.id}
                            className="archive-item"
                        >
                            <input
                                type="checkbox"
                                className="archive-item-checkbox"
                                checked={selectedForAuction.includes(entry.id)}
                                onChange={() => toggleSelectForAuction(entry.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <img 
                                src={entry.image} 
                                alt={entry.critique.title}
                                onClick={() => viewEntry(entry)}
                            />
                            <div className="archive-item-info">
                                <h3 className="archive-item-title">
                                    {entry.critique.title}
                                </h3>
                                <p className="archive-item-artist">
                                    {entry.critique.artist}
                                </p>
                                <p className="archive-item-year">
                                    {entry.critique.year}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
                            <p style={{ fontSize: '14px', fontWeight: '400', marginBottom: '5px' }}>
                                {work.critique.title}
                            </p>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                                {work.critique.artist}
                            </p>
                            <div className="starting-price-input">
                                <label>Starting Price</label>
                                <input
                                    type="number"
                                    value={startingPrices[work.id]}
                                    onChange={(e) => updateStartingPrice(work.id, e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
                <button className="start-auction-button" onClick={startAuction}>
                    Begin Auction
                </button>
                <button 
                    className="nav-button" 
                    onClick={cancel}
                    style={{ padding: '15px 40px' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function LiveAuction({ currentWork, currentBid, bidHistory, endCurrentAuction, auctionIndex, totalWorks }) {
    return (
        <div className="auction-live">
            <div style={{ marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
                <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Lot {auctionIndex + 1} of {totalWorks}
                </p>
            </div>
            
            <div className="auction-live-grid">
                <div className="auction-artwork-display">
                    <img src={currentWork.image} alt={currentWork.critique.title} />
                    <h3 style={{ fontSize: '20px', fontWeight: '400', marginBottom: '8px' }}>
                        {currentWork.critique.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>
                        {currentWork.critique.artist}, {currentWork.critique.year}
                    </p>
                    <div className="current-bid">
                        ${currentBid.toLocaleString()}
                    </div>
                    
                    <div style={{ marginTop: '40px' }}>
                        <button className="end-auction-button" onClick={endCurrentAuction}>
                            {auctionIndex + 1 < totalWorks ? 'Sold - Next Lot' : 'Sold - End Auction'}
                        </button>
                        <p style={{ 
                            fontSize: '11px', 
                            color: '#666', 
                            marginTop: '15px',
                            textAlign: 'center',
                            letterSpacing: '0.5px'
                        }}>
                            Click when bidding slows
                        </p>
                    </div>
                </div>
                
                <div className="bid-history">
                    <h4 className="bid-history-title">Live Bidding</h4>
                    
                    {bidHistory.length === 0 ? (
                        <p style={{ 
                            fontSize: '12px', 
                            color: '#666',
                            fontStyle: 'italic',
                            marginTop: '20px'
                        }}>
                            Waiting for first bid...
                        </p>
                    ) : (
                        bidHistory.map((bid, index) => (
                            <div key={index} className="bid-item" style={{
                                animation: index === 0 ? 'bidEnter 0.3s ease-out' : 'none'
                            }}>
                                <p className="bid-amount">${bid.amount.toLocaleString()}</p>
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                                    {bid.bidder}
                                </p>
                                <p className="bid-time">{bid.time}</p>
                            </div>
                        ))
                    )}
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
                            <div>
                                <p style={{ fontSize: '13px', fontWeight: '400' }}>
                                    {result.work.critique.title}
                                </p>
                                <p className="summary-label">{result.totalBids} bids</p>
                            </div>
                            <div className="summary-value">
                                ${result.finalBid.toLocaleString()}
                            </div>
                        </div>
                    ))}
                    
                    <div className="final-price">
                        Total: ${totalRevenue.toLocaleString()}
                    </div>
                </div>
                
                <p style={{ 
                    fontSize: '12px', 
                    color: '#666', 
                    marginBottom: '30px',
                    lineHeight: '1.8'
                }}>
                    Works have been removed from archive. All institutional value has been successfully liquidated.
                </p>
                
                <button
                    className="start-auction-button"
                    onClick={closeSummary}
                >
                    Return to Archive
                </button>
            </div>
        </div>
    );
}

function GalleryWallView({ walls, openArtMarket, viewEntry, selectedForAuction, toggleSelectForAuction, openPurchasedArtActions }) {
    const renderArtwork = (wall, index) => {
        if (!wall) {
            return (
                <div 
                    className="perspective-empty-slot"
                    onClick={() => openArtMarket(index)}
                >
                    <span className="plus-icon">+</span>
                </div>
            );
        }

        const imageUrl = wall.type === 'archive' ? wall.content.image : wall.content.image;
        const title = wall.type === 'archive' ? wall.content.critique.title : wall.content.title;
        const isArchive = wall.type === 'archive';
        const isPurchased = wall.type === 'purchased';
        const isSelected = isArchive && selectedForAuction && selectedForAuction.includes(wall.id);

        return (
            <div className="perspective-artwork">
                {isArchive && (
                    <input
                        type="checkbox"
                        className="gallery-artwork-checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectForAuction(wall.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
                
                <img 
                    src={imageUrl}
                    alt={title}
                    onClick={() => {
                        if (isArchive) {
                            viewEntry(wall.content);
                        } else if (isPurchased) {
                            openPurchasedArtActions(wall, index);
                        }
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer'
                    }}
                />
            </div>
        );
    };

    return (
        <div className="perspective-gallery">
            <div className="perspective-room">
                <div className="gallery-grid">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
                        <div key={index} className="perspective-slot">
                            {renderArtwork(walls[index], index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArtMarketModal({ fakeArtPieces, galleryFunds, purchaseFakeArt, onClose }) {
    return (
        <div className="art-market-overlay" onClick={onClose}>
            <div className="art-market-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <h2 style={{ 
                        fontSize: '18px', 
                        fontWeight: '400',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Art Market
                    </h2>
                    <div>
                        <p style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>Available Funds</p>
                        <p style={{ fontSize: '18px', fontWeight: '400' }}>${galleryFunds.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="art-market-grid">
                    {fakeArtPieces.map((piece, index) => (
                        <div key={index} className="art-market-item">
                            <div className="art-market-image">
                                <img src={piece.image} alt={piece.title} />
                            </div>
                            <div className="art-market-info">
                                <h3 style={{ fontSize: '13px', fontWeight: '400', marginBottom: '4px' }}>
                                    {piece.title}
                                </h3>
                                <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                                    {piece.artist}
                                </p>
                                <p style={{ fontSize: '16px', fontWeight: '400', marginBottom: '12px' }}>
                                    ${piece.price.toLocaleString()}
                                </p>
                                <button
                                    className="purchase-button"
                                    onClick={() => purchaseFakeArt(piece)}
                                    disabled={galleryFunds < piece.price}
                                >
                                    {galleryFunds < piece.price ? 'Insufficient Funds' : 'Purchase'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button 
                    className="nav-button" 
                    onClick={onClose}
                    style={{ marginTop: '30px' }}
                >
                    Close
                </button>
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
                <div className="purchased-art-preview">
                    <img src={wall.content.image} alt={wall.content.title} />
                </div>
                
                <div className="purchased-art-details">
                    <h2 style={{ 
                        fontSize: '20px', 
                        fontWeight: '400',
                        marginBottom: '8px'
                    }}>
                        {wall.content.title}
                    </h2>
                    <p style={{ 
                        fontSize: '14px', 
                        color: '#666',
                        marginBottom: '20px'
                    }}>
                        {wall.content.artist}
                    </p>
                    
                    <div style={{ 
                        padding: '20px',
                        background: '#f8f8f8',
                        border: '1px solid #e0e0e0',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ 
                            fontSize: '11px', 
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: '#666',
                            marginBottom: '15px'
                        }}>
                            Market Valuation
                        </h3>
                        
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>Artist Status:</span>
                            <span style={{ fontSize: '13px', marginLeft: '10px', textTransform: 'capitalize' }}>
                                {valuation.prestige}
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>Exhibition History:</span>
                            <p style={{ fontSize: '12px', marginTop: '5px', lineHeight: '1.6' }}>
                                Displayed at {valuation.exhibitions}
                            </p>
                        </div>
                        
                        <div style={{ 
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>Original Purchase:</span>
                                <span style={{ fontSize: '14px', marginLeft: '10px' }}>
                                    ${wall.content.price.toLocaleString()}
                                </span>
                            </div>
                            
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>Current Value:</span>
                                <span style={{ 
                                    fontSize: '18px', 
                                    marginLeft: '10px',
                                    fontWeight: '400'
                                }}>
                                    ${valuation.value.toLocaleString()}
                                </span>
                            </div>
                            
                            <div>
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                    {isProfitable ? 'Profit:' : 'Loss:'}
                                </span>
                                <span style={{ 
                                    fontSize: '16px', 
                                    marginLeft: '10px',
                                    color: isProfitable ? '#22c55e' : '#ef4444',
                                    fontWeight: '500'
                                }}>
                                    {isProfitable ? '+' : ''}${valuation.profit.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <button
                            className="start-auction-button"
                            onClick={onSell}
                            style={{ flex: 1 }}
                        >
                            Sell for ${valuation.value.toLocaleString()}
                        </button>
                        <button
                            className="nav-button"
                            onClick={onSwap}
                            style={{ flex: 1, padding: '15px' }}
                        >
                            Swap Artwork
                        </button>
                    </div>
                    
                    <button
                        className="nav-button"
                        onClick={onClose}
                        style={{ width: '100%', padding: '12px' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);