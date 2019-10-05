export class Naming {
    private _greek = [
        'Achelous',
        'Aeolus',
        'Aether',
        'Alastor',
        'Apollo',
        'Ares',
        'Aristaeus',
        'Asclepius',
        'Atlas',
        'Attis',
        'Boreas',
        'Caerus',
        'Castor',
        'Cerus',
        'Chaos',
        'Charon',
        'Cronos',
        'Crios',
        'Cronus',
        'Dinlas',
        'Deimos',
        'Dionysus',
        'Erebus',
        'Eros',
        'Eurus',
        'Glaucus',
        'Hadas',
        'Helios',
        'Hephaestus',
        'Heracles',
        'Hermes',
        'Hesperus',
        'Hymenaios',
        'Hypnos',
        'Kratos',
        'Momus',
        'Morpheus',
        'Nereus',
        'Notus',
        'Oceanus',
        'Oneiroi',
        'Paean',
        'Pallas',
        'Pan',
        'Plutus',
        'Pollux',
        'Pontus',
        'Poseidon',
        'Priapus',
        'Pricus',
        'Prometheus',
        'Primordial',
        'Tartarus',
        'Thanatos',
        'Triton',
        'Typhon',
        'Uranus',
        'Zelus',
        'Zephyrus',
        'Zeus'
    ];

    public get greek(): string {
        if (this._greek.length < 1) return 'Nameless';
        var index = this.random(0, this._greek.length - 1);
        var name = this._greek[index];
        this._greek.splice(index, 1);
        return name;
    }

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
