import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const guitars = [
    {name: "Fender Strat", desc: "Single-coil pickups"},
    {name: "Gibson Les Paul", desc: "Sunburst color"},
];

const pedals = [
    {name: "TC Electronic Flashback", desc: "Feedback, delay, level"},
    {name: "Ibanez Tube Screamer", desc: "Level, Gain, Tone"},
    {name: "Green Russian Big Muff", desc: "Volume, Tone, Gain"},
    {name: "Boss BD-2", desc: "Level, Tone, Gain"},
];

const amps = [
    {name: "Fender Champion", desc: "Treble, Bass, EQ: Delay, Chorus, Reverb"},
    {name: "Fender Blues Junior", desc: "Tubes, 15W, full EQ"},
    {name: "Boss Katana", desc: "Solid state, full EQ, onboard FX"},
]

export default function Page() {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row">
                <header>Gear</header>
                <Button variant="outline" className="ml-auto">Add Gear</Button>
            </div>
            <div>
                <Tabs defaultValue="guitars">
                    <TabsList>
                        <TabsTrigger value="guitars">Guitars</TabsTrigger>
                        <TabsTrigger value="pedals">Pedals</TabsTrigger>
                        <TabsTrigger value="amps">Amps</TabsTrigger>
                    </TabsList>

                    <TabsContent value="guitars">
                        <div className="grid grid-cols-3 space-x-2 space-y-2">
                            {guitars.map((guitar) => (
                                <Card key={guitar.name}>
                                    <CardHeader>
                                        <CardTitle>{guitar.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{guitar.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="pedals">
                        <div className="grid grid-cols-3 space-x-2 space-y-2">
                            {pedals.map((pedal) => (
                                <Card key={pedal.name}>
                                    <CardHeader>
                                        <CardTitle>{pedal.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{pedal.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="amps">
                        <div className="grid grid-cols-3 space-x-2 space-y-2">
                            {amps.map((amp) => (
                                <Card key={amp.name}>
                                    <CardHeader>
                                        <CardTitle>{amp.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{amp.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}