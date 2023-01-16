import MainPage from '../../../pages/main';
import { productsFilteringUsingDualSliders } from '../helpers';

class DualSlider {
    public createDualSlider(filter: 'price' | 'stock', parentElem: HTMLElement) {
        const sortByFilterData = MainPage.filtredByCheckboxesData.sort((a, b) => a[filter] - b[filter]);
        const minValue = sortByFilterData[0][filter];
        const maxValue = sortByFilterData[sortByFilterData.length - 1][filter];

        const sliderTitle = document.createElement('h3');
        sliderTitle.className = 'slider__title';
        sliderTitle.innerText = `${filter[0].toUpperCase()}${filter.slice(1)}`;
        parentElem.append(sliderTitle);

        const sliderControl = document.createElement('div');
        sliderControl.className = 'slider__control';

        const sliderValue = document.createElement('div');
        sliderValue.className = 'slider__value';

        const fromValue = document.createElement('span');
        fromValue.id = 'fromValue';
        fromValue.innerText = `${minValue}`;

        const toValue = document.createElement('span');
        toValue.id = 'toValue';
        toValue.innerText = `${maxValue}`;

        sliderValue.append(fromValue);
        sliderValue.append('⇔');
        sliderValue.append(toValue);
        sliderControl.append(sliderValue);

        const fromSlider = document.createElement('input');
        fromSlider.type = 'range';
        fromSlider.id = 'fromSlider';
        fromSlider.name = filter;
        fromSlider.min = `${minValue}`;
        fromSlider.defaultValue = `${MainPage.settings.rangeValues[filter].from}`;
        fromSlider.max = `${maxValue}`;

        const toSlider = document.createElement('input');
        toSlider.type = 'range';
        toSlider.id = 'toSlider';
        toSlider.name = filter;
        toSlider.min = `${minValue}`;
        toSlider.max = `${maxValue}`;
        toSlider.defaultValue = `${MainPage.settings.rangeValues[filter].to}`;

        this.addStylesAndListners(fromSlider, toSlider, fromValue, toValue);

        sliderControl.append(fromSlider);
        sliderControl.append(toSlider);

        parentElem.append(sliderControl);
    }

    private addStylesAndListners(
        fromSlider: HTMLInputElement,
        toSlider: HTMLInputElement,
        fromValue: HTMLElement,
        toValue: HTMLElement
    ) {
        this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#f9b54c', toSlider);

        if (Number(toSlider.value) <= 0) {
            toSlider.style.zIndex = '2';
        } else {
            toSlider.style.zIndex = '0';
        }

        fromSlider.oninput = () => this.controlSlider(fromSlider, toSlider, fromValue);
        toSlider.oninput = () => this.controlSlider(fromSlider, toSlider, toValue);
        fromSlider.onchange = () => productsFilteringUsingDualSliders();
        toSlider.onchange = () => productsFilteringUsingDualSliders();
    }

    private fillSlider(
        from: HTMLInputElement,
        to: HTMLInputElement,
        sliderColor: string,
        rangeColor: string,
        controlSlider: HTMLInputElement
    ) {
        const rangeDistance = +to.max - +to.min;
        const fromPosition = +from.value - +to.min;
        const toPosition = +to.value - +to.min;
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
          ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
          ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
          ${sliderColor} 100%)`;
    }

    private controlSlider(fromSlider: HTMLInputElement, toSlider: HTMLInputElement, valueElem: HTMLElement) {
        const from = parseInt(fromSlider.value, 10);
        const to = parseInt(toSlider.value, 10);
        this.fillSlider(fromSlider, toSlider, '#C6C6C6', '#f9b54c', toSlider);

        const filter = fromSlider.name as 'price' | 'stock';
        MainPage.settings.rangeValues[filter].from = from;
        MainPage.settings.rangeValues[filter].to = to;

        if (valueElem.id === 'fromValue') {
            if (from > to) {
                fromSlider.value = `${to}`;
                valueElem.innerText = `${to}`;
            } else {
                valueElem.innerText = `${from}`;
            }
        } else {
            if (Number(toSlider.value) <= 0) {
                toSlider.style.zIndex = '2';
            } else {
                toSlider.style.zIndex = '0';
            }

            if (from <= to) {
                toSlider.value = `${to}`;
                valueElem.innerText = `${to}`;
            } else {
                valueElem.innerText = `${from}`;
                toSlider.value = `${from}`;
            }
        }
    }
}

export default DualSlider;
