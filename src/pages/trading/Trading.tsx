import './index.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, Phone, User } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';


const wasteTypes = [
	{
		value: 'plastic-bottles',
		label: 'Plastic Bottles',
		rate: 1,
		output: 'Good Soil',
		image:
			'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBzb2lsJTIwY29tcG9zdHxlbnwxfHx8fDE3NTk1NjAyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
	},
	{
		value: 'paper-cardboard',
		label: 'Paper & Cardboard',
		rate: 1,
		output: 'Fertilizer',
		image:
			'https://images.unsplash.com/photo-1539902879984-7a1fa3844e48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmVydGlsaXplciUyMHNvaWwlMjBjb25kaXRpb25lcnxlbnwxfHx8fDE3NTk1NjAyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
	},
	{
		value: 'organic-waste',
		label: 'Organic Waste',
		rate: 1,
		output: 'Compost',
		image:
			'https://images.unsplash.com/photo-1708432331128-cfe5a2803781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0JTIwb3JnYW5pYyUyMHdhc3RlJTIwZmVydGlsaXplcnxlbnwxfHx8fDE3NTk1NjAyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
	},
	{
		value: 'cans-metal',
		label: 'Cans & Metal',
		rate: 1,
		output: 'Vermitech/Liquid Conditioner',
		image:
			'https://images.unsplash.com/photo-1678129456841-47b1aca89e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJtaWNvbXBvc3QlMjBsaXF1aWQlMjBmZXJ0aWxpemVyJTIwdGVhfGVufDF8fHx8MTc1OTU2MDIyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
	},
];

const programCategories = [
	{
		title: 'CIRCULAR ECONOMY',
		items: [
			'ROTTING MIX / SOIL CONDITIONER',
			'FERTILIZER',
			'VERMITECH / LIQUID CONDITIONER',
		],
	},
	{
		title: 'RECYCLABLE TRADING ACTIVITY',
		items: [
			'SINGLE - USE SOFT AND HARD PLASTICS',
			'CANDY AND CHOCOLATE WRAPPERS',
			'PLASTIC BAGS, FOOD WRAPPING',
			'FOOD TAKEAWAY CONTAINERS',
			'USED CLOTHES / RAGS',
			'BOTTLES, JARS, CHIPS, FIBERGLASS',
			'USED COTTON CLOTHES',
		],
	},
	{
		title: 'TRASH TO CASHBACK',
		items: [
			'GENERAL SOLID WASTE MATERIALS',
			'TRASH TO SCHOOL SUPPLIES',
			'OFFICE SUPPLIES AND MATERIALS',
		],
	},
	{
		title: 'TRASH TO BOOKS',
		items: ['EDUCATIONAL MATERIALS', 'READING MATERIALS FOR COMMUNITY'],
	},
	{
		title: 'TRASH TO MEDICINES',
		items: [
			'HERBAL MEDICINE',
			'FIRST AID SUPPLIES',
			'MEDICAL EQUIPMENT FOR COMMUNITY',
		],
	},
	{
		title: 'ECO BRICK MAKING',
		items: [
			'BASIC URBAN FARMING TUTORIAL',
			'BASIC SEWING TUTORIAL AND LIVELIHOOD',
			'ECO BRICK MAKING',
			'FIESTA TRAINING',
		],
	},
	{
		title: 'COMMUNITY PANTRY / SOUP KITCHEN',
		items: [
			'FOOD DISTRIBUTION',
			'COMMUNITY MEALS',
			'NUTRITION PROGRAMS',
		],
	},
];

export default function App() {
	const [selectedType, setSelectedType] = useState('');
	const [weight, setWeight] = useState('');
	const [result, setResult] = useState<{
		points: number;
		output: string;
		image: string;
	} | null>(null);

	const handleConvert = () => {
		console.log('Button clicked! selectedType:', selectedType, 'weight:', weight);
		if (selectedType && weight) {
			const wasteType = wasteTypes.find(
				(type) => type.value === selectedType
			);
			if (wasteType) {
				const points = parseFloat(weight) * wasteType.rate;
				setResult({
					points,
					output: wasteType.output,
					image: wasteType.image,
				});
			}
		} else {
			alert('Please select a recyclable type and enter weight!');
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Breadcrumb */}
			<div className="bg-gray-50 py-3 px-6 border-b border-gray-200">
				<div className="max-w-7xl mx-auto">
					<nav className="text-sm text-gray-600">
						<Link to="/" className="hover:underline">Home</Link>
						<span className="mx-2">/</span>
						<span>EcoCycle</span>
					</nav>
				</div>
			</div>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-12">
				<div className="text-center mb-8">
					<h1 className="mb-2">Eco Cycle</h1>
					<p className="text-gray-600">
						Calculate how much valuable product you can get from your recyclable
						waste
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
					{/* Input Panel */}
					<Card style={{backgroundColor: '#f1f8f4', borderColor: '#c8e6c9'}}>
						<CardHeader>
							<CardTitle className="flex items-center" style={{color: '#1b4c2e'}}>
								<div className="w-6 h-6 rounded-full text-white flex items-center justify-center text-sm mr-2" style={{backgroundColor: '#1b4c2e'}}>
									♻
								</div>
								Input
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="block text-sm mb-2" style={{color: '#1b4c2e'}}>
									Select Recyclable Type:
								</label>
								<Select
									value={selectedType}
									onValueChange={setSelectedType}
								>
									<SelectTrigger className="bg-white h-10 px-4 w-full" style={{borderColor: '#a5d6a7'}}>
										<SelectValue placeholder="Choose recyclable type" />
									</SelectTrigger>
									<SelectContent>
										{wasteTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="block text-sm mb-3" style={{color: '#1b4c2e'}}>
									Enter weight (e.g., 2.5 kg):
								</label>
								<Input
									type="number"
									placeholder="2 KG"
									value={weight}
									onChange={(e) => setWeight(e.target.value)}
									className="bg-white h-9 px-4 w-full"
									style={{borderColor: '#a5d6a7'}}
								/>
							</div>

							<Button
								onClick={handleConvert}
								className="w-full z-10 h-12 text-base font-semibold mt-2"
								style={{backgroundColor: '#1b4c2e'}}
							>
								Convert
							</Button>
						</CardContent>
					</Card>

					{/* Result Panel */}
					<Card style={{backgroundColor: '#f1f8f4', borderColor: '#c8e6c9'}}>
						<CardHeader>
							<CardTitle className="flex items-center" style={{color: '#1b4c2e'}}>
								<div className="w-6 h-6 rounded-full text-white flex items-center justify-center text-sm mr-2" style={{backgroundColor: '#1b4c2e'}}>
									📊
								</div>
								Result
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-center mb-4" style={{color: '#1b4c2e'}}>
									Conversion Result:
								</p>

								<div className="space-y-4">
									<div className="flex justify-between items-center p-2 bg-red-50 rounded">
										<span className="text-red-600">Input:</span>
										<span className="text-red-600">
											{weight
												? `${weight} kg ${wasteTypes.find(
														(t) => t.value === selectedType
												  )?.label || ''}`
												: '-'}
										</span>
									</div>

									<div className="p-4 bg-orange-50 rounded flex flex-col items-center">
										<span className="text-orange-600 mb-2">Output:</span>
										{result && (
											<ImageWithFallback
												src={result.image}
												alt={result.output}
												className="w-48 h-48 rounded object-cover mb-2" // Increased size and centered
											/>
										)}
										<span className="text-orange-600">
											{result
												? `${(parseFloat(weight) * 0.2).toFixed(
														1
												  )} kg ${result.output}`
												: '-'}
										</span>
									</div>

									<div className="flex justify-between items-center p-2 rounded" style={{backgroundColor: '#f1f8f4'}}>
										<span style={{color: '#1b4c2e'}}>Estimated Value:</span>
										<span style={{color: '#1b4c2e'}}>
											{result
												? `${result.points} ${
														result.points === 1
															? 'point'
															: 'points'
												  }`
												: '-'}
										</span>
									</div>
								</div>

								<div className="mt-4 text-center">
									<p className="text-gray-600 mb-2">TOTAL:</p>
									<p className="text-2xl" style={{color: '#1b4c2e'}}>
										{result
											? `${result.points} ${
													result.points === 1
														? 'point'
														: 'points'
											  }`
											: '0 points'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Check Your Points */}
				<div className="flex justify-center items-center bg-gray-50 py-12">
					<div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full border" style={{borderColor: '#c8e6c9'}}>
						<h3 className="mb-4 text-lg font-semibold text-center" style={{color: '#1b4c2e'}}>
							Check Your Record Points Here
						</h3>
						<div className="space-y-4">
							<div>
								<label
									className="block text-sm mb-2"
									htmlFor="record-id"
									style={{color: '#1b4c2e'}}
								>
									Record ID
								</label>
								<Input
									id="record-id"
									type="text"
									placeholder="BT-"
									className="bg-white px-4 py-2 rounded border shadow-sm w-full"
									style={{color: '#1b4c2e', borderColor: '#c8e6c9'}}
								/>
							</div>
							<div>
								<label
									className="block text-sm mb-2"
									htmlFor="last-name"
									style={{color: '#1b4c2e'}}
								>
									Last Name
								</label>
								<Input
									id="last-name"
									type="text"
									placeholder="Enter your last name"
									className="bg-white px-4 py-2 rounded border shadow-sm w-full"
									style={{color: '#1b4c2e', borderColor: '#c8e6c9'}}
								/>
							</div>
							<Button
								className="text-white px-6 py-2 rounded shadow-md w-full transition-all"
								style={{backgroundColor: '#1b4c2e'}}
								onClick={() => alert('Check Record feature coming soon!')}
							>
								Check Record
							</Button>
						</div>
					</div>
				</div>

				{/* TaliPanahATIN Program */}
				<Card className="shadow-lg mt-8" style={{background: 'linear-gradient(to bottom right, #f1f8f4, #e8f5e9)', borderColor: '#c8e6c9'}}>
					<CardHeader className="text-center text-white rounded-t-lg" style={{background: 'linear-gradient(to right, #1b4c2e, #256d3f)'}}>
						<CardTitle className="text-2xl">
							"May Buhay sa Basura ng Barangay"
							<br />
							<span className="text-xl opacity-80">TaliPaPaNatin</span>
						</CardTitle>
						<p className="mt-2 opacity-90">
							Community Waste Management Programs
						</p>
					</CardHeader>
					<CardContent className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{programCategories.map((category, index) => (
								<div
									key={index}
									className="bg-white rounded-lg p-5 border shadow-sm hover:shadow-md transition-shadow duration-200"
									style={{borderColor: '#c8e6c9'}}
								>
									<div className="flex items-center mb-4">
										<div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#1b4c2e'}}>
											<span className="text-white text-sm">✓</span>
										</div>
										<h4 className="leading-tight" style={{color: '#1b4c2e'}}>
											{category.title}
										</h4>
									</div>
									<ul className="space-y-2">
										{category.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className="text-sm text-gray-700 flex items-start"
											>
												<span className="mr-2 mt-1 text-xs" style={{color: '#1b4c2e'}}>
													●
												</span>
												<span className="leading-relaxed">{item}</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>

						<div className="mt-8 text-center bg-white rounded-lg p-6 border shadow-sm" style={{borderColor: '#c8e6c9'}}>
							<div className="mb-4">
								<h4 className="mb-2" style={{color: '#1b4c2e'}}>Contact Information</h4>
								<p className="text-gray-600 mb-1">📞 DESK OFFICER HOTLINE:</p>
								<p style={{color: '#1b4c2e'}}>
									8-7110745 / 0917-5586735
								</p>
							</div>

							<div className="border-t pt-4" style={{borderColor: '#c8e6c9'}}>
								<p style={{color: '#1b4c2e'}}>
									<span className="block">ATTY. ERIC JUAN & COUNCIL</span>
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</main>

			{/* Footer */}
			<footer className="text-white py-8 mt-12" style={{backgroundColor: '#1b4c2e'}}>
				<div className="container mx-auto px-4">
					<div className="text-center mb-4">
						<h3 className="mb-2">TaliSHAGATH Program</h3>
						<p className="opacity-90">
							Harnesses TalaSHA - Promoting circular economy through sustainable
							waste management
						</p>
					</div>

					<div className="flex justify-center space-x-8 text-sm">
						<a
							href="#"
							className="opacity-80 hover:opacity-100 transition-opacity"
						>
							Clean & Recycling
						</a>
						<a
							href="#"
							className="opacity-80 hover:opacity-100 transition-opacity"
						>
							Circular Economy
						</a>
						<a
							href="#"
							className="opacity-80 hover:opacity-100 transition-opacity"
						>
							Community Programs
						</a>
						<a
							href="#"
							className="opacity-80 hover:opacity-100 transition-opacity"
						>
							Environmental Care
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}