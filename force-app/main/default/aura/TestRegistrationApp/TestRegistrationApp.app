<!-- userAccountCreationContainer.cmp -->
<aura:application
  implements="force:appHostable,flexipage:availableForAllPageTypes"
  extends="force:slds"
>
  <!-- Attributes -->
  <aura:attribute name="currentStep" type="String" default="1" />
  <aura:attribute name="userId" type="String" />

  <!-- Progress Indicator -->
  <lightning:progressIndicator
    currentStep="{!v.currentStep}"
    type="base"
    variant="base"
  >
    <lightning:progressStep label="User Information" value="1" />
    <lightning:progressStep label="Account Information" value="2" />
  </lightning:progressIndicator>

  <div class="slds-p-around_medium">
    <!-- Conditionally render User Form or Account Form based on currentStep -->
    <aura:if isTrue="{!v.currentStep == '1'}">
      <c:userForm onusercreated="{!c.handleUserCreated}" />
      <aura:set attribute="else">
        <c:accountForm
          userId="{!v.userId}"
          onback="{!c.handleBack}"
          oncomplete="{!c.handleComplete}"
        />
      </aura:set>
    </aura:if>
  </div>
</aura:application>
