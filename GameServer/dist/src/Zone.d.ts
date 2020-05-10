import { Feature } from './Feature';
export declare class Zone {
    id: string;
    features: Feature[];
    private random;
    private distance;
    private generatePlanets;
    private generateFeaturesLonely;
    private generateFeaturesTwins;
    private generateFeaturesPacked;
    private generateVessels;
    private generatePlotAttackWing;
    generate(): void;
}
