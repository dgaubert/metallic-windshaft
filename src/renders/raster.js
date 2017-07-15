export default class Raster {
  constructor (cartonik) {
    this.cartonik = cartonik
  }

  async tile ({ layer, coords, format }) {
    const map = await this.cartonik.load({ path: layer })
    map.extent = this.cartonik.extent(coords)
    const image = await this.cartonik.render({ map })
    const tile = await this.cartonik.encode({ image, encoding: format })

    return tile
  }
}
